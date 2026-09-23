import { createCipheriv, publicEncrypt, randomBytes } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(readFileSync(new URL('../preview-access.json', import.meta.url), 'utf8'));
if (config.version !== 1) throw new Error('Unsupported preview access configuration.');
const template = readFileSync(new URL('./preview-login.html', import.meta.url), 'utf8');
const root = new URL('../dist/', import.meta.url);
const key = randomBytes(32);
const wrappedKey = publicEncrypt({ key: config.publicKey, oaepHash: 'sha256' }, key).toString('base64');
const buildId = randomBytes(16).toString('hex');
let count = 0;

function protect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      protect(path);
    } else if (/\.html?$/i.test(entry.name)) {
      const html = readFileSync(path, 'utf8');
      if (html.includes('id="preview-payload"')) throw new Error('Rebuild before applying protection again.');
      const iv = randomBytes(12);
      const cipher = createCipheriv('aes-256-gcm', key, iv);
      const ciphertext = Buffer.concat([cipher.update(html, 'utf8'), cipher.final(), cipher.getAuthTag()]);
      const { publicKey, ...access } = config;
      const payload = { access, wrappedKey, buildId, iv: iv.toString('base64'), ciphertext: ciphertext.toString('base64') };
      writeFileSync(path, template.replace('__PREVIEW_PAYLOAD__', JSON.stringify(payload)));
      count++;
    }
  }
}

protect(decodeURIComponent(root.pathname));
if (!count) throw new Error('No HTML pages found; nothing was protected.');
writeFileSync(new URL('robots.txt', root), 'User-agent: *\nDisallow: /\n');
console.log(`Protected ${count} HTML pages. Public assets and repository sources remain public.`);
