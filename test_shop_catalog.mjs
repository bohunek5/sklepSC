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
const viewportArgument = process.argv.find((argument) => argument.startsWith('--viewport='));
const viewportMatch = viewportArgument?.slice('--viewport='.length).match(/^(\d+)x(\d+)$/i);
const viewportWidth = viewportMatch ? Number(viewportMatch[1]) : mobile ? 390 : 1440;
const viewportHeight = viewportMatch ? Number(viewportMatch[2]) : mobile ? 844 : 1000;
const emulateMobile = viewportWidth <= 600;
const screenshotArgument = process.argv.find((argument) => argument.startsWith('--screenshot='));
const screenshotPath = screenshotArgument?.slice('--screenshot='.length);
const filterScreenshotArgument = process.argv.find((argument) => argument.startsWith('--filter-screenshot='));
const filterScreenshotPath = filterScreenshotArgument?.slice('--filter-screenshot='.length);
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
        if (message.method === 'Runtime.consoleAPICalled') {
          console.log('[Browser Console]', message.params.args.map(a => a.value || a.description || '').join(' '));
        } else if (message.method === 'Runtime.exceptionThrown') {
          console.error('[Browser Exception]', message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
        }
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
    mobile: emulateMobile
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
      filterVisible: getComputedStyle(document.querySelector('#advancedFilterContainer')).visibility !== 'hidden',
      resetFunction: typeof window.resetShopCatalogFilters
    };
  })()`);

  if (audit.productCount !== 24) throw new Error(`Nieprawidłowa liczba produktów na stronie: ${audit.productCount}.`);
  if (audit.addButtons !== audit.productCount || audit.buyButtons !== audit.productCount) {
    throw new Error('Karty utraciły istniejące przyciski zakupu.');
  }
  if (audit.horizontalOverflow) throw new Error('Katalog powoduje poziome przewijanie.');
  if (audit.resetFunction !== 'function') throw new Error('Reset filtrów nie został udostępniony.');

  await evaluate(client, `document.querySelector('[data-type="expect"][data-val="Brak kropek"]').click()`);
  await waitFor(client, `document.querySelector('#shopResultSummary').textContent !== 'Produkty 1–24 z 1323'`);
  const filteredAudit = await evaluate(client, `(() => {
    const total = Number(document.querySelector('#shopResultSummary').textContent.match(/z\\s+(\\d+)/)?.[1] || 0);
    const cards = [...document.querySelectorAll('#shopGrid .mockup-product-card')];
    return {
      total,
      cards: cards.length,
      activeChips: document.querySelectorAll('#activeChipsContainer .active-chip').length,
      url: window.location.search,
      applyText: document.querySelector('#applyFiltersBtn').textContent.trim(),
      buyAction: cards[0]?.querySelector('.buy-it-now-btn')?.getAttribute('onclick') || ''
    };
  })()`);
  if (!filteredAudit.total || filteredAudit.total >= 1323) throw new Error(`Filtr COB nie zawęził katalogu: ${JSON.stringify(filteredAudit)}.`);
  if (!filteredAudit.activeChips || !filteredAudit.url.includes('expect=')) throw new Error('Aktywny filtr nie jest widoczny lub zapisany w URL.');
  if (!filteredAudit.buyAction.includes("checkout.html")) throw new Error('Przycisk Szybki zakup utracił swoje działanie.');

  await evaluate(client, `document.querySelector('.toggle-btn[data-mode="b2b"]').click()`);
  await evaluate(client, `document.querySelector('[data-type="voltage"][data-val="24V"]').click()`);
  await waitFor(client, `Number(document.querySelector('#shopResultSummary').textContent.match(/z\\s+(\\d+)/)?.[1] || 0) < ${filteredAudit.total}`);
  const proFilterAudit = await evaluate(client, `({
    total: Number(document.querySelector('#shopResultSummary').textContent.match(/z\\s+(\\d+)/)?.[1] || 0),
    activeChips: document.querySelectorAll('#activeChipsContainer .active-chip').length,
    mode: document.querySelector('.toggle-btn[data-mode="b2b"]').getAttribute('aria-pressed')
  })`);
  if (!proFilterAudit.total || proFilterAudit.activeChips !== 2 || proFilterAudit.mode !== 'true') {
    throw new Error(`Filtry PRO nie łączą kryteriów: ${JSON.stringify(proFilterAudit)}.`);
  }

  await evaluate(client, `(() => {
    const select = document.querySelector('#shopSortSelect');
    select.value = 'price-asc';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  const sortedPrices = await evaluate(client, `[...document.querySelectorAll('#shopGrid .catalog-current-price')].map((element) => Number(element.textContent.replace(',', '.').replace(/[^0-9.]/g, '')))`);
  if (sortedPrices.some((price, index) => index > 0 && price < sortedPrices[index - 1])) {
    throw new Error('Sortowanie ceny rosnąco nie działa.');
  }

  await evaluate(client, `document.querySelector('#shopGrid .add-to-cart-btn').click()`);
  const cart = await evaluate(client, `(() => {
    const items = JSON.parse(localStorage.getItem('prescot_cart') || '[]');
    return { rows: items.length, quantity: items.reduce((sum, item) => sum + Number(item.qty || 1), 0) };
  })()`);
  if (cart.rows !== 1 || cart.quantity !== 1) throw new Error(`Istniejący przycisk Dodaj do koszyka działa wielokrotnie: ${JSON.stringify(cart)}.`);

  await evaluate(client, `document.querySelector('#catalogResetFilters').click()`);
  await waitFor(client, `document.querySelector('#shopResultSummary').textContent.includes('1323')`);

  if (filterScreenshotPath) {
    await evaluate(client, `document.querySelector('#mobileFabFilterBtn').click()`);
    await waitFor(client, `document.querySelector('#advancedFilterContainer').classList.contains('active')`);
    await delay(220);
    const filterScreenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(filterScreenshotPath, Buffer.from(filterScreenshot.data, 'base64'));
    await evaluate(client, `document.querySelector('#closeFilterSheetBtn').click()`);
  }

  if (screenshotPath) {
    await evaluate(client, `window.scrollTo(0, document.querySelector('.shop-container').offsetTop)`);
    await delay(250);
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  }

  console.log(JSON.stringify({ ...audit, filteredAudit, proFilterAudit, sortedPrices: sortedPrices.slice(0, 5), cart }, null, 2));
} finally {
  client?.close();
  browser.kill();
  await delay(250);
  try { rmSync(profilePath, { recursive: true, force: true }); } catch { /* Profil może być jeszcze zwalniany. */ }
}
