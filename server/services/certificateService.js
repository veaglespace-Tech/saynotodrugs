import 'regenerator-runtime/runtime.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (name, certificateNumber, date, language = 'english', config) => {
  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  
  // Register fontkit
  pdfDoc.registerFontkit(fontkit);
  
  // Load standard fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  // Load Devanagari font (always used for Name to prevent box rendering issues)
  let customFont = timesRomanFont; // fallback
  try {
    const fontBytes = fs.readFileSync(path.join(__dirname, '../fonts/NotoSansDevanagari-Regular.ttf'));
    customFont = await pdfDoc.embedFont(fontBytes);
  } catch (err) {
    console.error('Could not load custom font, falling back to standard font.', err);
  }

  // The full image is landscape. Typical size 1024x683
  const width = 1024;
  const height = 683;
  const page = pdfDoc.addPage([width, height]);
  
  // Load the full JPEG certificate template
  try {
    const templatePath = path.join(__dirname, '../assets/certificate_full.jpg');
    if (fs.existsSync(templatePath)) {
      const templateBytes = fs.readFileSync(templatePath);
      const templateImage = await pdfDoc.embedJpg(templateBytes);
      
      // Draw template to cover the entire page
      page.drawImage(templateImage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });
    } else {
        throw new Error('Full certificate image not found in assets');
    }
  } catch (err) {
    console.error('Template image not found or could not be loaded.', err);
    page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.95, 0.95, 0.95) });
  }

  // The certificate section is on the right half. (x: 512 to 1024)
  // The visual center of the certificate is slightly shifted, around 785
  const certCenterX = 768; // True center of the right pane (512 to 1024)
  
  // Name - Centered vertically around the blank space below "PROUDLY PRESENTED TO"
  // Assuming "PROUDLY PRESENTED TO" is around y = 480, we place name around y = 430
  const isDevanagari = /[\u0900-\u097F]/.test(name);
  const nameFont = isDevanagari ? customFont : timesRomanBoldFont;
  const nameSize = 34;
  const nameWidth = nameFont.widthOfTextAtSize(name, nameSize);
  
  page.drawText(name, {
    x: certCenterX - (nameWidth / 2),
    y: height * 0.62, // ~423
    size: nameSize,
    font: nameFont,
    color: rgb(0.1, 0.2, 0.4), // Dark Blue to match theme
  });

  // Verification QR Code
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certificateNumber}`; 
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, color: { dark: '#0a192f', light: '#ffffff' } });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  const qrSize = 85;
  
  // Position QR Code at bottom left of the certificate half
  // Move it up so it doesn't overlap the bottom ribbon and stays left of the wreath
  const certLeftX = 540;
  const bottomY = 85;
  
  page.drawImage(qrImage, {
    x: certLeftX,
    y: bottomY,
    width: qrSize,
    height: qrSize,
  });

  // Date and Certificate ID below QR code, drawn in dark blue so it is visible on the cream background
  const dateStr = `Date: ${date}`;
  const idStr = `ID: ${certificateNumber}`;
  const dateWidth = timesRomanBoldFont.widthOfTextAtSize(dateStr, 10);
  const idWidth = timesRomanBoldFont.widthOfTextAtSize(idStr, 10);
  
  const qrCenterX = certLeftX + (qrSize / 2);

  page.drawText(dateStr, {
    x: qrCenterX - (dateWidth / 2),
    y: bottomY - 14,
    size: 10,
    font: timesRomanBoldFont,
    color: rgb(0.1, 0.2, 0.4),
  });

  page.drawText(idStr, {
    x: qrCenterX - (idWidth / 2),
    y: bottomY - 26,
    size: 10,
    font: timesRomanBoldFont,
    color: rgb(0.1, 0.2, 0.4),
  });

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
