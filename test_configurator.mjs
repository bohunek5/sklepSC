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
if (!browserPath) throw new Error('Nie znaleziono Chrome ani Edge do testu konfiguratora.');

const mobile = process.argv.includes('--mobile');
const viewportArgument = process.argv.find((argument) => argument.startsWith('--viewport='));
const viewportMatch = viewportArgument?.slice('--viewport='.length).match(/^(\d+)x(\d+)$/i);
const viewportWidth = viewportMatch ? Number(viewportMatch[1]) : mobile ? 390 : 1440;
const viewportHeight = viewportMatch ? Number(viewportMatch[2]) : mobile ? 844 : 1000;
const emulateMobile = viewportWidth <= 600;
const screenshotArgument = process.argv.find((argument) => argument.startsWith('--screenshot='));
const screenshotPath = screenshotArgument?.slice('--screenshot='.length);
const heroScreenshotArgument = process.argv.find((argument) => argument.startsWith('--hero-screenshot='));
const heroScreenshotPath = heroScreenshotArgument?.slice('--hero-screenshot='.length);
const openCategories = process.argv.includes('--open-categories');
const stepScreenshotArgument = process.argv.find((argument) => argument.startsWith('--step-screenshot='));
const stepScreenshotPath = stepScreenshotArgument?.slice('--step-screenshot='.length);
const scenarioArgument = process.argv.find((argument) => argument.startsWith('--scenario='));
const scenarioName = scenarioArgument?.slice('--scenario='.length) || 'basic';
const scenarios = {
  basic: { application: 'kitchen', intensity: 'functional', technology: 'cob', expectedTechnology: 'COB', light: 'neutral', length: 5, segments: 1, environment: 'dry', control: 'switch', voltage: 'auto', ready: true, minProducts: 2 },
  smd: { application: 'kitchen', intensity: 'functional', technology: 'smd', expectedTechnology: 'SMD', light: 'neutral', length: 5, segments: 1, environment: 'dry', control: 'switch', voltage: 'auto', ready: true, minProducts: 2 },
  outdoor: { application: 'outdoor', intensity: 'functional', technology: 'auto', light: 'neutral', length: 10, segments: 2, environment: 'outdoor', control: 'switch', voltage: 'auto', ready: true, minProducts: 2 },
  'rgb-smart': { application: 'living', intensity: 'decorative', technology: 'auto', light: 'rgb', length: 5, segments: 1, environment: 'dry', control: 'smart', voltage: 'auto', ready: true, minProducts: 3 },
  long: { application: 'commercial', intensity: 'strong', technology: 'auto', light: 'neutral', length: 100, segments: 1, environment: 'dry', control: 'switch', voltage: '24', ready: true, minProducts: 2 }
};
const scenario = scenarios[scenarioName];
if (!scenario) throw new Error(`Nieznany scenariusz: ${scenarioName}`);
const port = 9300 + Math.floor(Math.random() * 500);
const profilePath = mkdtempSync(join(tmpdir(), 'prescot-configurator-'));
const browser = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  `--window-size=${viewportWidth},${viewportHeight}`,
  'http://localhost:3000/configurator.html'
], { stdio: 'ignore' });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function debuggerTarget() {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const target = targets.find((item) => item.type === 'page' && item.url.includes('configurator.html'));
      if (target) return target;
    } catch {
      // Przeglądarka dopiero uruchamia port debugowania.
    }
    await delay(150);
  }
  throw new Error('Przeglądarka nie udostępniła strony testowej.');
}

class CdpClient {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(message.error.message));
        else resolve(message.result);
      } else if (message.method) {
        this.events.push(message);
      }
    });
  }

  send(method, params = {}) {
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

async function evaluate(client, expression) {
  const response = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  }
  return response.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(client, expression)) return;
    await delay(100);
  }
  throw new Error(`Przekroczono czas oczekiwania: ${expression}`);
}

let client;
try {
  const target = await debuggerTarget();
  client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Runtime.enable');
  await client.send('Log.enable');
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile: emulateMobile
  });
  await client.send('Page.reload', { ignoreCache: true });
  await waitFor(client, `document.readyState === 'complete' && document.querySelector('#catalogLoading')?.hidden === true`);

  const initial = await evaluate(client, `({
    title: document.title,
    catalogFailed: !document.querySelector('#catalogError').hidden,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    overflowElements: [...document.querySelectorAll('body *')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > window.innerWidth + 1 || rect.left < -1;
      })
      .slice(0, 8)
      .map((element) => ({ tag: element.tagName, className: element.className, left: Math.round(element.getBoundingClientRect().left), right: Math.round(element.getBoundingClientRect().right) })),
    viewport: [window.innerWidth, window.innerHeight]
  })`);
  if (initial.catalogFailed) throw new Error('Katalog zgłosił błąd w interfejsie.');
  if (initial.horizontalOverflow) throw new Error(`Strona ma poziomy overflow przed rozpoczęciem konfiguracji: ${JSON.stringify(initial.overflowElements)}`);

  const initialFunnel = await evaluate(client, `({
    count: Number(document.querySelector('#funnelCount')?.textContent),
    enabledOptions: [...document.querySelectorAll('.config-step[data-step="0"] input[type="radio"]:not(:disabled)')].length,
    invalidEnabledOptions: [...document.querySelectorAll('.config-step[data-step="0"] input[type="radio"]:not(:disabled)')]
      .filter((input) => input.closest('label')?.querySelector('.option-availability')?.textContent.includes('Brak zgodnych')).length
  })`);
  if (!initialFunnel.count || !initialFunnel.enabledOptions || initialFunnel.invalidEnabledOptions) {
    throw new Error(`Lejek nie wystartował z poprawną pulą produktów: ${JSON.stringify(initialFunnel)}`);
  }

  if (openCategories) {
    await evaluate(client, `window.openMobileCategories(); true`);
    await waitFor(client, `document.querySelector('#mobileCategoriesDrawer')?.classList.contains('is-open')`, 3000);
    await delay(320);
  }
  if (heroScreenshotPath) {
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(heroScreenshotPath, Buffer.from(screenshot.data, 'base64'));
  }
  if (openCategories) {
    await evaluate(client, `window.closeMobileCategories(); true`);
    await delay(320);
  }
  if (stepScreenshotPath) {
    await evaluate(client, `(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.querySelector('#configurator').offsetTop);
      return true;
    })()`);
    await delay(150);
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(stepScreenshotPath, Buffer.from(screenshot.data, 'base64'));
  }

  async function selectAndNext(name, value, expectedStep) {
    const status = await evaluate(client, `(() => {
      const option = document.querySelector('input[name="${name}"][value="${value}"]');
      const unavailable = option.disabled || option.closest('label')?.classList.contains('is-unavailable');
      if (!unavailable) option.click();
      const disabled = document.querySelector('#nextButton').disabled;
      if (!disabled) document.querySelector('#nextButton').click();
      return { disabled, unavailable, funnelCount: Number(document.querySelector('#funnelCount').textContent), validation: document.querySelector('#validationMessage').textContent };
    })()`);
    if (status.unavailable) throw new Error(`Scenariusz próbuje wybrać wygaszoną opcję ${name}=${value}.`);
    if (!status.funnelCount) throw new Error(`Opcja ${name}=${value} doprowadziła lejek do zera.`);
    if (status.disabled) throw new Error(`Przycisk Dalej pozostał nieaktywny dla pola ${name}.`);
    await waitFor(client, `document.querySelector('.config-step[data-step="${expectedStep}"]').hidden === false`, 3000);
    const nextStepAudit = await evaluate(client, `(() => {
      const step = document.querySelector('.config-step[data-step="${expectedStep}"]');
      const enabled = [...step.querySelectorAll('input[type="radio"]:not(:disabled)')];
      return {
        enabled: enabled.length,
        invalidEnabled: enabled.filter((input) => input.closest('label')?.querySelector('.option-availability')?.textContent.includes('Brak zgodnych')).length,
        funnelCount: Number(document.querySelector('#funnelCount').textContent)
      };
    })()`);
    if (!nextStepAudit.funnelCount || nextStepAudit.invalidEnabled || (expectedStep !== 3 && !nextStepAudit.enabled)) {
      throw new Error(`Krok ${expectedStep + 1} ma nieprawidłowe zawężenie: ${JSON.stringify(nextStepAudit)}`);
    }
  }

  await selectAndNext('application', scenario.application, 1);
  await evaluate(client, `document.querySelector('input[name="technology"][value="${scenario.technology}"]').click()`);
  await selectAndNext('intensity', scenario.intensity, 2);
  await selectAndNext('light', scenario.light, 3);
  const dimensionsStatus = await evaluate(client, `(() => {
    document.querySelector('#lengthInput').value = '${scenario.length}';
    document.querySelector('#lengthInput').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#segmentsInput').value = '${scenario.segments}';
    document.querySelector('#segmentsInput').dispatchEvent(new Event('input', { bubbles: true }));
    const disabled = document.querySelector('#nextButton').disabled;
    if (!disabled) document.querySelector('#nextButton').click();
    return { disabled, validation: document.querySelector('#validationMessage').textContent };
  })()`);
  if (dimensionsStatus.disabled) throw new Error('Przycisk Dalej pozostał nieaktywny dla wymiarów.');
  await waitFor(client, `document.querySelector('.config-step[data-step="4"]').hidden === false`, 3000);
  if (scenario.application === 'outdoor') {
    const outdoorProtection = await evaluate(client, `({
      dryDisabled: document.querySelector('input[name="environment"][value="dry"]').disabled,
      dampDisabled: document.querySelector('input[name="environment"][value="damp"]').disabled,
      outdoorDisabled: document.querySelector('input[name="environment"][value="outdoor"]').disabled
    })`);
    if (!outdoorProtection.dryDisabled || !outdoorProtection.dampDisabled || outdoorProtection.outdoorDisabled) {
      throw new Error(`Lejek dopuścił niewłaściwe IP dla zastosowania zewnętrznego: ${JSON.stringify(outdoorProtection)}`);
    }
  }
  await selectAndNext('environment', scenario.environment, 5);
  const finalStatus = await evaluate(client, `(() => {
    document.querySelector('input[name="control"][value="${scenario.control}"]').click();
    document.querySelector('input[name="voltage"][value="${scenario.voltage}"]').click();
    const disabled = document.querySelector('#nextButton').disabled;
    if (!disabled) document.querySelector('#nextButton').click();
    return { disabled, validation: document.querySelector('#validationMessage').textContent };
  })()`);
  if (finalStatus.disabled) throw new Error('Przycisk wyniku pozostał nieaktywny dla sterowania.');
  await waitFor(client, `document.querySelector('#results')?.hidden === false`);

  const result = await evaluate(client, `({
    summary: [...document.querySelectorAll('.result-context span')].map((element) => element.textContent.trim()),
    selectedTape: document.querySelector('.selected-tape-content h3')?.textContent.trim(),
    selectedTapeSku: document.querySelector('.product-codes')?.textContent.trim(),
    selectedTechnology: document.querySelector('.product-spec-grid div:nth-child(4) strong')?.textContent.trim(),
    productRows: document.querySelectorAll('.selected-tape-card').length + document.querySelectorAll('.system-item:not(.advisory)').length,
    addDisabled: document.querySelector('[data-action="add-bundle"]')?.disabled,
    noResults: Boolean(document.querySelector('.no-results')),
    warningCount: document.querySelectorAll('.status-pill.warning').length,
    longRunWarning: Boolean(document.querySelector('.result-warning')),
    finalTapeOptions: 1 + document.querySelectorAll('.alternative-card').length,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  })`);
  if (result.noResults) throw new Error('Scenariusz podstawowy nie zwrócił produktu.');
  if (!result.selectedTape || !result.selectedTapeSku?.includes('SKU:')) throw new Error(`Scenariusz ${scenarioName} nie pokazał konkretnej taśmy z kodem SKU.`);
  if (scenario.expectedTechnology && result.selectedTechnology !== scenario.expectedTechnology) throw new Error(`Scenariusz ${scenarioName} dobrał technologię ${result.selectedTechnology} zamiast ${scenario.expectedTechnology}.`);
  if (result.productRows < scenario.minProducts) throw new Error(`Scenariusz ${scenarioName} dobrał za mało produktów.`);
  if (result.finalTapeOptions < 1 || result.finalTapeOptions > 3) throw new Error(`Lejek zakończył się liczbą opcji spoza zakresu 1–3: ${result.finalTapeOptions}.`);
  if (result.addDisabled === scenario.ready) throw new Error(`Scenariusz ${scenarioName} ma nieprawidłowy stan przycisku koszyka.`);
  if (!scenario.ready && result.warningCount === 0) throw new Error(`Scenariusz ${scenarioName} nie wyjaśnia brakującego elementu.`);
  if (result.horizontalOverflow) throw new Error('Wynik konfiguratora ma poziomy overflow.');

  await evaluate(client, `document.querySelector('[data-action="add-tape"]').click()`);
  const tapeCart = await evaluate(client, `JSON.parse(localStorage.getItem('prescot_cart') || '[]').length`);
  if (tapeCart < 1) throw new Error('Dobrana taśma nie została dodana do koszyka.');
  if (scenario.ready) await evaluate(client, `document.querySelector('[data-action="add-bundle"]').click()`);
  const cart = await evaluate(client, `({
    badge: document.querySelector('#cartBadge').textContent.trim(),
    items: JSON.parse(localStorage.getItem('prescot_cart') || '[]').length
  })`);
  if (scenario.ready && cart.items < scenario.minProducts) throw new Error('Zestaw nie został zapisany w koszyku.');

  if (screenshotPath) {
    await evaluate(client, `(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.querySelector('#results').offsetTop);
      return true;
    })()`);
    await evaluate(client, `Promise.race([
      Promise.all([...document.querySelectorAll('#results img')].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))),
      new Promise((resolve) => setTimeout(resolve, 3000))
    ])`);
    await delay(200);
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  }

  const runtimeErrors = client.events.filter((event) =>
    event.method === 'Runtime.exceptionThrown' ||
    (event.method === 'Log.entryAdded' && event.params.entry.level === 'error')
  );
  if (runtimeErrors.length) throw new Error(`Błędy runtime: ${JSON.stringify(runtimeErrors)}`);

  console.log(JSON.stringify({ scenario: scenarioName, initial, result, cart, screenshotPath: screenshotPath || null, heroScreenshotPath: heroScreenshotPath || null, stepScreenshotPath: stepScreenshotPath || null }, null, 2));
} finally {
  client?.close();
  browser.kill();
  await delay(300);
  try { rmSync(profilePath, { recursive: true, force: true }); } catch { /* Profil może być jeszcze zwalniany przez Windows. */ }
}
