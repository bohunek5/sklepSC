import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
const browserPath = browserCandidates.find(existsSync);
if (!browserPath) throw new Error('Nie znaleziono Chrome ani Edge.');

const sitePort = 12000 + Math.floor(Math.random() * 1000);
const debugPort = 9512 + Math.floor(Math.random() * 200);
const profilePath = mkdtempSync(join(tmpdir(), 'prescot-led-config-'));
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(sitePort), '--host', '127.0.0.1', '--strictPort'], { stdio: 'ignore' });
const browser = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profilePath}`,
  '--window-size=1440,1000',
  `http://127.0.0.1:${sitePort}/konfigurator-led.html`
], { stdio: 'ignore' });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findTarget() {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
      const target = targets.find((item) => item.type === 'page' && item.url.includes('konfigurator-led.html'));
      if (target) return target;
    } catch {
      // Serwer lub port debuggera jeszcze startuje.
    }
    await delay(150);
  }
  throw new Error('Nie znaleziono karty konfiguratora.');
}

class CdpClient {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.exceptions = [];
    this.socket = new WebSocket(url);
    this.socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      }
      if (message.method === 'Runtime.exceptionThrown') {
        this.exceptions.push(message.params.exceptionDetails.text);
      }
    };
  }

  async connect() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
      this.socket.onerror = reject;
    });
  }

  command(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function evaluate(client, expression) {
  const response = await client.command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  }
  return response.result.value;
}

async function capture(client, path) {
  const result = await client.command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(path, Buffer.from(result.data, 'base64'));
}

let client;
try {
  const target = await findTarget();
  client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.command('Page.enable');
  await client.command('Runtime.enable');
  await client.command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await delay(2200);

  const initial = await evaluate(client, `({
    url: location.href,
    title: document.title,
    steps: document.querySelectorAll('.wizard-step').length,
    activeStep: document.querySelector('.wizard-step:not([hidden])')?.dataset.step,
    environmentCount: document.querySelectorAll('[data-field="environment"]').length,
    price: document.querySelector('#summaryPrice')?.textContent,
    headerLink: document.querySelector('.config-desktop-nav a.active')?.textContent.trim(),
    headerCartSvg: Boolean(document.querySelector('#headerCartButton svg')),
    mobileCartIcon: document.querySelector('#mobileCartButton i')?.classList.contains('ph-shopping-cart-simple'),
    cartDrawerReady: Boolean(document.querySelector('#cartDrawer')) && typeof window.openCartDrawer === 'function',
    buttonStyles: {
      nextBackground: getComputedStyle(document.querySelector('#nextButton')).backgroundColor,
      nextColor: getComputedStyle(document.querySelector('#nextButton')).color,
      nextBorder: getComputedStyle(document.querySelector('#nextButton')).borderTopColor,
      regularBackground: getComputedStyle(document.querySelector('[data-field="environment"][data-value="kitchen"]')).backgroundColor,
      selectedBackground: getComputedStyle(document.querySelector('[data-field="environment"][data-value="living"]')).backgroundColor
    },
    scene: document.querySelector('#sceneMedia') ? getComputedStyle(document.querySelector('#sceneMedia')).backgroundImage : null,
    bodyStart: document.body?.textContent?.trim().slice(0, 120)
  })`);
  console.log('INITIAL', initial);
  assert(initial.title === 'Konfigurator LED | Prescot', 'Niepoprawny tytuł strony.');
  assert(initial.steps === 6, 'Konfigurator nie ma sześciu kroków.');
  assert(initial.activeStep === '0', 'Pierwszy krok nie jest aktywny.');
  assert(initial.environmentCount === 12, 'Konfigurator nie ma dwunastu stref montażu.');
  assert(initial.headerLink.includes('Konfigurator LED'), 'Brakuje pozycji Konfigurator LED w menu.');
  assert(initial.headerCartSvg && initial.mobileCartIcon, 'Nie przywrócono właściwych ikon koszyka.');
  assert(initial.cartDrawerReady, 'Boczny koszyk nie został zainicjalizowany.');
  assert(initial.buttonStyles.nextBackground === 'rgb(255, 255, 255)', 'Przycisk podstawowy nie ma białego tła.');
  assert(initial.buttonStyles.nextColor === 'rgb(11, 26, 48)' && initial.buttonStyles.nextBorder === 'rgb(11, 26, 48)', 'Przycisk podstawowy nie ma granatowego tekstu i ramki.');
  assert(initial.buttonStyles.regularBackground === 'rgb(255, 255, 255)' && initial.buttonStyles.selectedBackground === 'rgb(16, 43, 76)', 'Karty wyboru nie korzystają ze wspólnego systemu kolorów.');
  assert(initial.scene.includes('living_new.png'), 'Nie wczytano obrazu sceny.');

  const nextPoint = await evaluate(client, `(() => {
    const rect = document.querySelector('#nextButton').getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await client.command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: nextPoint.x, y: nextPoint.y });
  await delay(250);
  const hoverStyles = await evaluate(client, `({
    background: getComputedStyle(document.querySelector('#nextButton')).backgroundColor,
    color: getComputedStyle(document.querySelector('#nextButton')).color
  })`);
  assert(hoverStyles.background === 'rgb(16, 43, 76)' && hoverStyles.color === 'rgb(255, 255, 255)', 'Hover przycisku nie odwraca kolorów.');
  await client.command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 2 });
  await delay(250);
  await capture(client, 'configurator-desktop.png');

  const flow = await evaluate(client, `(async () => {
    const click = (selector) => document.querySelector(selector).click();
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    click('#headerCartButton');
    await wait(450);
    const headerDrawerOpened = getComputedStyle(document.querySelector('#cartDrawer')).right === '0px'
      && getComputedStyle(document.querySelector('#cartDrawerOverlay')).pointerEvents !== 'none';
    click('#closeCartDrawer');
    await wait(450);
    click('[data-field="environment"][data-value="garden"]');
    const newZoneWorks = document.querySelector('#visualIp').textContent === 'IP67'
      && document.querySelector('#sceneMedia').style.backgroundImage.includes('cat_garden.png')
      && document.querySelector('#summaryVoltage').textContent === '24 V';
    click('[data-field="environment"][data-value="bathroom"]');
    click('#nextButton');
    click('[data-field="shape"][data-value="l"]');
    const inputs = [...document.querySelectorAll('[data-dimension-index]')];
    inputs[0].value = 143;
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = 225;
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    click('#nextButton');
    click('[data-field="light"][data-value="rgbw"]');
    click('[data-field="technology"][data-value="smd"]');
    click('#nextButton');
    const cornerDisabled = document.querySelector('[data-field="profile"][data-value="corner"]').disabled;
    click('[data-field="diffuser"][data-value="black"]');
    click('#nextButton');
    click('[data-field="powerPlacement"][data-value="plug"]');
    click('#nextButton');
    click('[data-field="control"][data-value="zigbee"]');
    const plugPlay = document.querySelector('#plugPlay');
    plugPlay.checked = true;
    plugPlay.dispatchEvent(new Event('change', { bubbles: true }));
    click('#summaryDetailsButton');
    const dialogOpen = document.querySelector('#bomDialog').open;
    const bomCount = document.querySelectorAll('#bomList .bom-item').length;
    click('#dialogAddButton');
    await wait(450);
    const cart = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    const criteria = window.PrescotLedConfigurator?.getCatalogCriteria();
    return {
      headerDrawerOpened,
      drawerOpenedAfterAdd: getComputedStyle(document.querySelector('#cartDrawer')).right === '0px',
      newZoneWorks,
      ip: document.querySelector('#visualIp').textContent,
      length: document.querySelector('#summaryLength').textContent,
      cornerDisabled,
      dialogOpen,
      bomCount,
      cartAdded: cart.some((item) => String(item.id).startsWith('led-config-')),
      cartLines: cart.filter((item) => String(item.id).startsWith('led-config-')).length,
      cartHasCriteria: cart.filter((item) => String(item.id).startsWith('led-config-')).every((item) => item.catalogCriteria?.selectionMode === 'attribute-filter'),
      criteria,
      currentStep: document.querySelector('.wizard-step:not([hidden])')?.dataset.step,
      price: document.querySelector('#summaryPrice').textContent
    };
  })()`);
  assert(flow.headerDrawerOpened && flow.drawerOpenedAfterAdd, 'Koszyk nie wysuwa się z boku.');
  assert(flow.newZoneWorks, 'Nowa strefa ogrodu nie ustawia sceny, IP67 i 24 V.');
  assert(flow.ip === 'IP65', 'Filtr środowiska nie ustawił IP65.');
  assert(flow.length.includes('3,7'), 'Wymiary nie zostały zaokrąglone do 3,7 m.');
  assert(flow.cornerDisabled, 'Profil 10 mm nie został zablokowany dla taśmy RGBW 12 mm.');
  assert(flow.currentStep === '5', 'Nie osiągnięto ostatniego kroku.');
  assert(flow.dialogOpen && flow.bomCount >= 6, 'BOM nie otworzył się lub jest niekompletny.');
  assert(flow.cartAdded, 'Zestaw nie został zapisany w koszyku.');
  assert(flow.cartLines >= 6, 'Koszyk nie otrzymał rozbitej listy BOM.');
  assert(flow.cartHasCriteria, 'Pozycje konfiguracji nie zawierają kryteriów katalogowych.');
  assert(flow.criteria?.minimumIp === 65 && flow.criteria?.technology === 'SMD', 'Kryteria filtrowania katalogu są niepełne.');

  await client.command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await client.command('Page.reload', { ignoreCache: true });
  await delay(1800);
  const mobile = await evaluate(client, `(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    document.querySelector('#mobileCartButton').click();
    await wait(450);
    const cartOpened = getComputedStyle(document.querySelector('#cartDrawer')).right === '0px';
    document.querySelector('#closeCartDrawer').click();
    await wait(450);
    document.querySelector('#menuButton').click();
    const menuOpened = !document.querySelector('#configMobileMenu').hidden;
    const menuPolluted = Boolean(document.querySelector('#configMobileMenu .close-mobile-menu'));
    document.querySelector('#menuButton').click();
    return {
      bottomNav: getComputedStyle(document.querySelector('.config-bottom-nav')).display,
      summaryBottom: getComputedStyle(document.querySelector('.live-summary')).bottom,
      environmentCount: document.querySelectorAll('[data-field="environment"]').length,
      cartOpened,
      menuOpened,
      menuPolluted,
      nextButton: {
        text: document.querySelector('#nextButton').textContent.trim(),
        color: getComputedStyle(document.querySelector('#nextButton')).color,
        fontSize: getComputedStyle(document.querySelector('#nextButton')).fontSize,
        rect: document.querySelector('#nextButton').getBoundingClientRect().toJSON()
      },
      viewport: [innerWidth, innerHeight],
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  })()`);
  assert(mobile.bottomNav === 'grid', 'Mobilna nawigacja nie jest widoczna.');
  assert(mobile.environmentCount === 12, 'Na mobile brakuje nowych stref.');
  assert(mobile.cartOpened, 'Przycisk koszyka w mobilnym menu nie otwiera draweru.');
  assert(mobile.menuOpened && !mobile.menuPolluted, 'Mobilne menu konfiguratora jest uszkodzone przez wspólny moduł.');
  assert(mobile.summaryBottom === '76px', 'Podsumowanie mobilne nie znajduje się nad dolnym menu.');
  assert(!mobile.horizontalOverflow, 'Widok mobilny ma poziomy overflow.');
  await capture(client, 'configurator-mobile.png');

  if (client.exceptions.length) throw new Error(`Błędy JavaScript: ${client.exceptions.join(', ')}`);
  console.log(JSON.stringify({ initial, flow, mobile }, null, 2));
} finally {
  client?.close();
  browser.kill();
  server.kill();
  await delay(300);
  rmSync(profilePath, { recursive: true, force: true });
}
