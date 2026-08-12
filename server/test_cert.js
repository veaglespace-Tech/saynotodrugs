import { generateCertificate } from './services/certificateService.js';
import fs from 'fs';

async function test() {
  try {
    const config = { pledgeEnglish: 'Test' };
    const buffer = await generateCertificate('Test Name', 'SND-123', '12 Aug 2026', 'english', config);
    fs.writeFileSync('test.pdf', buffer);
    console.log('Success');
  } catch (err) {
    console.error('Error generating certificate:', err);
  }
}

test();
