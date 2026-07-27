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

const mobile = process.argv.includes('--mobile');
const viewportWidth = mobile ? 390 : 1440;
const viewportHeight = mobile ? 844 : 1000;
const screenshotArgument = process.argv.find((argument) => argument.startsWith('--screenshot='));
const screenshotPath = screenshotArgument?.slice('--screenshot='.length);
const port = 9800 + Math.floor(Math.random() * 150);
const profilePath = mkdtempSync(join(tmpdir(), 'prescot-shop-'));
const browser = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profilePath}`,
  `--window-size=${viewportWidth},${viewportHeight}`,
  'http://localhost:3000/shop.html'
], { stdio: 'ignore' });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function debuggerTarget() {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const target = targets.find((item) => item.type === 'page' && item.url.includes('shop.html'));
      if (target) return target;
    } catch {
      // Przeglądarka uruchamia port debugowania.
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

async function waitFor(client, expression, timeout = 10000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evaluate(client, expression)) return;
    await delay(120);
  }
  throw new Error(`Przekroczono czas oczekiwania: ${expression}`);
}

let client;
try {
  const target = await debuggerTarget();
  client = new CdpClient(target.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('Log.enable');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewportWidth,
    height: viewportHeight,
    deviceScaleFactor: 1,
    mobile
  });
  await client.send('Page.reload', { ignoreCache: true });
  await waitFor(client, `document.readyState === 'complete'`);
  await waitFor(client, `document.querySelectorAll('#shopGrid .mockup-product-card').length > 0`, 15000);

  const audit = await evaluate(client, `(() => {
    const grid = document.querySelector('#shopGrid');
    const gridRect = grid.getBoundingClientRect();
    const cards = [...grid.querySelectorAll('.mockup-product-card')];
    const firstCard = cards[0];
    const firstRect = firstCard.getBoundingClientRect();
    return {
      viewport: [window.innerWidth, window.innerHeight],
      productCount: cards.length,
      resultText: document.querySelector('#shopResultSummary')?.textContent.trim() || '',
      columns: getComputedStyle(grid).gridTemplateColumns,
      gridRect: { left: Math.round(gridRect.left), right: Math.round(gridRect.right), width: Math.round(gridRect.width) },
      firstCard: { width: Math.round(firstRect.width), height: Math.round(firstRect.height) },
      addButtons: grid.querySelectorAll('.add-to-cart-btn').length,
      buyButtons: grid.querySelectorAll('.buy-it-now-btn').length,
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      filterVisible: getComputedStyle(document.querySelector('#advancedFilterContainer')).visibility !== 'hidden'
    };
  })()`);

  if (audit.productCount !== 24) throw new Error(`Nieprawidłowa liczba produktów na stronie: ${audit.productCount}.`);
  if (audit.addButtons !== audit.productCount || audit.buyButtons !== audit.productCount) {
    throw new Error('Karty utraciły istniejące przyciski zakupu.');
  }
  if (audit.horizontalOverflow) throw new Error('Katalog powoduje poziome przewijanie.');

  if (screenshotPath) {
    await evaluate(client, `window.scrollTo(0, document.querySelector('.shop-container').offsetTop)`);
    await delay(250);
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  }

  console.log(JSON.stringify(audit, null, 2));
} finally {
  client?.close();
  browser.kill();
  await delay(250);
  try { rmSync(profilePath, { recursive: true, force: true }); } catch { /* Profil może być jeszcze zwalniany. */ }
}
