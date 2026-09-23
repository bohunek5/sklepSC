import { generateKeyPairSync, randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

// Read credentials from stdin so they never enter the repository or build logs.
const { username, password } = JSON.parse(readFileSync(0, 'utf8'));
if (!username || !password || password.length < 12) {
  throw new Error('Provide a username and a password of at least 12 characters via JSON stdin.');
}
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 3072 });
const salt = randomBytes(16);
const iv = randomBytes(12);
const iterations = 600000;
const key = pbkdf2Sync(JSON.stringify([username, password]), salt, iterations, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const encrypted = Buffer.concat([
  cipher.update(privateKey.export({ type: 'pkcs8', format: 'der' })),
  cipher.final(),
  cipher.getAuthTag(),
]);
const config = {
  version: 1,
  publicKey: publicKey.export({ type: 'spki', format: 'pem' }),
  salt: salt.toString('base64'),
  iterations,
  iv: iv.toString('base64'),
  privateKey: encrypted.toString('base64'),
};
writeFileSync(new URL('../preview-access.json', import.meta.url), JSON.stringify(config, null, 2) + '\n');
console.log('Preview access configured. Credentials were not saved.');
