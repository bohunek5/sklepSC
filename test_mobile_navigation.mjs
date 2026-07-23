import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const browserPath = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(existsSync);
if (!browserPath) throw new Error('Nie znaleziono Chrome ani Edge.');

const screenshotArg = process.argv.find((argument) => argument.startsWith('--screenshot='));
const screenshotPath = screenshotArg?.slice('--screenshot='.length);
const port = 9800 + Math.floor(Math.random() * 150);
const profilePath = mkdtempSync(join(tmpdir(), 'prescot-mobile-nav-'));
const browser = spawn(browserPath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profilePath}`,
  '--window-size=375,812', 'http://localhost:3000/index.html'
], { stdio: 'ignore' });
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function target() {
  const deadline = Date.now() + 12000;
  while (Date.now() < deadline) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = targets.find((item) => item.type === 'page' && item.url.includes('index.html'));
      if (page) return page;
    } catch { /* przeglądarka startuje */ }
    await delay(120);
  }
  throw new Error('Brak strony testowej.');
}

class Cdp {
  constructor(url) { this.id = 0; this.pending = new Map(); this.socket = new WebSocket(url); }
  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id || !this.pending.has(message.id)) return;
      const task = this.pending.get(message.id);
      this.pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.socket.close(); }
}

async function evaluate(client, expression) {
  const response = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

let client;
try {
  const page = await target();
  client = new Cdp(page.webSocketDebuggerUrl);
  await client.connect();
  await client.send('Runtime.enable');
  await client.send('Page.enable');
  await client.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.send('Page.reload', { ignoreCache: true });
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline && !(await evaluate(client, `document.readyState === 'complete' && Boolean(document.querySelector('#kategorie-banners'))`))) await delay(100);
  await delay(700);

  const audit = await evaluate(client, `(() => {
    const target = document.querySelector('#kategorie-banners');
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.scrollTop = target.offsetTop - 72;
    document.body.scrollTop = target.offsetTop - 72;
    const mainCards = target.querySelectorAll('.categories-banners-grid .category-banner-card');
    const subCards = target.querySelectorAll('.categories-sub-grid .category-banner-card');
    return {
      navItems: document.querySelectorAll('.mobile-nav-items .mobile-nav-item').length,
      mainCards: mainCards.length,
      subCards: subCards.length,
      mainColumns: getComputedStyle(target.querySelector('.categories-banners-grid')).gridTemplateColumns,
      subColumns: getComputedStyle(target.querySelector('.categories-sub-grid')).gridTemplateColumns,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollY: Math.round(window.scrollY),
      targetTop: Math.round(target.getBoundingClientRect().top),
      targetOffset: Math.round(target.offsetTop),
      ancestors: [target, ...(() => { const list=[]; let node=target.parentElement; while(node && list.length<5){ list.push(node); node=node.parentElement; } return list; })()].map((node) => ({ tag: node.tagName, id: node.id, overflowY: getComputedStyle(node).overflowY, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight }))
    };
  })()`);
  await delay(450);
  if (screenshotPath) {
    const screenshot = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: audit.targetOffset, width: 375, height: 812, scale: 1 } });
    writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  }
  if (audit.navItems !== 5 || audit.mainCards !== 2 || audit.subCards !== 6 || audit.overflow) throw new Error(`Nieprawidłowy mobile: ${JSON.stringify(audit)}`);
  console.log(JSON.stringify({ audit, screenshotPath: screenshotPath || null }, null, 2));
} finally {
  client?.close();
  browser.kill();
  await delay(250);
  try { rmSync(profilePath, { recursive: true, force: true }); } catch { /* profil może być zajęty */ }
}
