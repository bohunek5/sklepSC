import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, 'public', 'images', 'products');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

const urls = [
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/360_1.jpg?v=1762846284",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/1.4.jpg?v=1762848458",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/11.1.Staub_Cocotte_64de27fa-321b-4cb5-b44c-35cdbf5bf676.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/11.2.jpg?v=1762848458",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/16.1.Staub_Cocotte.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/6.1-Bistro-Bench.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/19.1.Staub_Cocotte.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/10.1Cutting-Board.jpg?v=1762848458",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/18.1.Staub_Cocotte.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/17.1.Staub_Cocotte.jpg?v=1762848458",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/12.1.Staub_Cocotte.jpg?v=1762848459",
  "https://cdn.shopify.com/s/files/1/0525/8739/7290/files/10.jpg?v=1762847196"
];

async function run() {
  console.log(`Downloading ${urls.length} verified demo product images...`);
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const filename = `product-${i + 1}.jpg`;
    const dest = path.join(outputDir, filename);
    console.log(`Downloading ${url} -> ${filename}`);
    try {
      await downloadImage(url, dest);
    } catch (err) {
      console.error(`Error downloading ${url}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run().catch(console.error);
