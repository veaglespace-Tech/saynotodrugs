import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://placehold.co/200x50/1e40af/ffffff/png?text=Veagle+Space';

function downloadImage(dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('Downloading placeholders...');
    await downloadImage(path.join(__dirname, '..', 'client', 'public', 'logo.png'));
    await downloadImage(path.join(__dirname, 'assets', 'veagle_logo.png'));
    console.log('Done!');
  } catch(e) {
    console.error('Error:', e);
  }
}

main();
