import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

// The JSON endpoint URL.
// Replace this with the actual endpoint URL.
const endpointUrl = 'https://p2p.binance.com/bapi/c2c/v1/friendly/c2c/trade-rule/fiat-list';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, '..', 'public', 'currencyIcons');

// Ensure the output directory exists.
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const fileStream = fs.createWriteStream(filepath);
  await new Promise((resolve, reject) => {
    Readable.fromWeb(response.body).pipe(fileStream);
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
}

async function main() {
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData.data) {
      console.error('Error: The JSON response is not in the expected format.');
      return;
    }

    for (const item of jsonData.data) {
      if (item.iconUrl && item.currencyCode) {
        const imageUrl = item.iconUrl;
        const currencyCode = item.currencyCode;
        const imagePath = path.join(outputDir, `${currencyCode}.png`);

        try {
          await downloadImage(imageUrl, imagePath);
          console.log(`Saved ${currencyCode}.png`);
        } catch (err) {
          console.error(`Error downloading image for ${currencyCode}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

main();