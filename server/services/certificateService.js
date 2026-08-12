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
  const timesRomanItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  
  // Load Devanagari font for Hindi/Marathi
  let customFont = timesRomanFont;
  let isDevanagari = language === 'hindi' || language === 'marathi';
  
  try {
    const fontBytes = fs.readFileSync(path.join(__dirname, '../fonts/NotoSansDevanagari-Regular.ttf'));
    customFont = await pdfDoc.embedFont(fontBytes);
  } catch (err) {
    console.error('Could not load custom font, falling back to standard font.', err);
  }

  // Load Veagle Logo if available
  let veagleLogoImage = null;
  try {
    const logoPath = path.join(__dirname, '../assets/veagle_logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath);
      veagleLogoImage = await pdfDoc.embedPng(logoBytes);
    }
  } catch (err) {
    console.error('Logo not found or could not be loaded.', err);
  }

  // Determine text based on language
  let titleText = 'CERTIFICATE OF PLEDGE';
  let pledgeTextToRender = config?.pledgeEnglish || 'I pledge to say NO to drugs.';
  
  if (language === 'hindi') {
    titleText = 'प्रतिज्ञा प्रमाण पत्र';
    pledgeTextToRender = config?.pledgeHindi || 'मैं नशीली दवाओं और मादक पदार्थों के सेवन को ना कहने की प्रतिज्ञा करता हूँ।';
  } else if (language === 'marathi') {
    titleText = 'प्रतिज्ञा प्रमाणपत्र';
    pledgeTextToRender = config?.pledgeMarathi || 'मी अमली पदार्थ आणि व्यसनांना नाही म्हणण्याची प्रतिज्ञा करतो.';
  }

  const certificateFormat = config?.certificateFormat || 'This certificate is proudly presented to {name} for taking the pledge to SAY NO TO DRUGS.';
  const introText = certificateFormat.replace('{name}', ''); // Just fallback if we don't use it directly

  // A4 size in portrait
  const width = 595.28;
  const height = 841.89;
  const page = pdfDoc.addPage([width, height]);
  
  // Outer Border (Gold-ish)
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.85, 0.65, 0.13), // Goldenrod
    borderWidth: 4,
  });
  
  // Inner Border (Dashed or Solid)
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: rgb(0.85, 0.65, 0.13),
    borderWidth: 1,
  });

  // Top Section (Logo + Heading)
  if (veagleLogoImage) {
    const logoDims = veagleLogoImage.scale(0.25);
    page.drawImage(veagleLogoImage, {
      x: width - logoDims.width - 40,
      y: height - logoDims.height - 40,
      width: logoDims.width,
      height: logoDims.height,
    });
  } else {
    // Text fallback for Veagle Space
    page.drawText('Veagle Space', {
      x: width - 130,
      y: height - 70,
      size: 16,
      font: timesRomanBoldFont,
      color: rgb(0.0, 0.3, 0.7), // Blue color like logo
    });
  }

  // CIN Number (mock)
  page.drawText('CIN No. - U62011PN2025PTC241963', {
    x: 40,
    y: height - 120,
    size: 10,
    font: timesRomanBoldFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Main Title
  page.drawText(titleText, {
    x: width / 2 - (isDevanagari ? 80 : 130),
    y: height - 100,
    size: 24,
    font: isDevanagari ? customFont : timesRomanBoldFont,
    color: rgb(0.1, 0.2, 0.5),
  });

  // Presentation Text (Golden Box bg)
  page.drawRectangle({
    x: width / 2 - 180,
    y: height - 280,
    width: 360,
    height: 30,
    color: rgb(0.85, 0.73, 0.2), // Gold bg
  });
  
  page.drawText('This Certificate is proudly presented to', {
    x: width / 2 - 140,
    y: height - 270,
    size: 18,
    font: timesRomanFont,
    color: rgb(1, 1, 1),
  });

  // Name
  const nameFont = isDevanagari ? customFont : timesRomanBoldFont;
  page.drawText(name, {
    x: width / 2 - (nameFont.widthOfTextAtSize(name, 26) / 2),
    y: height - 330,
    size: 26,
    font: nameFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Descriptive Text / Pledge
  const maxWidth = width - 100;
  const words = pledgeTextToRender.split(' ');
  let lines = [];
  let currentLine = '';
  const fontToUse = isDevanagari ? customFont : timesRomanFont;

  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const textWidth = fontToUse.widthOfTextAtSize(testLine, 12);
    if (textWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  let currentY = height - 390;
  
  for (const line of lines) {
    page.drawText(line.trim(), {
      x: width / 2 - (fontToUse.widthOfTextAtSize(line.trim(), 12) / 2),
      y: currentY,
      size: 12,
      font: fontToUse,
      color: rgb(0.3, 0.3, 0.3),
    });
    currentY -= 20;
  }

  // Footer Blue Area Background
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: 160,
    color: rgb(0.09, 0.27, 0.6), // Dark Blue
  });

  // Verification QR Code
  // Generate QR pointing to frontend verification url
  // Assuming frontend runs on same domain or we use the server URL. Since we don't know the exact domain, 
  // we can use a relative or placeholder domain. Ideally `process.env.NEXT_PUBLIC_CLIENT_URL`.
  // The client URL is usually what the user accesses.
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certificateNumber}`; 
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  
  const qrSize = 100;
  page.drawImage(qrImage, {
    x: width / 2 - (qrSize / 2),
    y: 50,
    width: qrSize,
    height: qrSize,
  });

  page.drawText(certificateNumber, {
    x: width / 2 - (timesRomanBoldFont.widthOfTextAtSize(certificateNumber, 12) / 2),
    y: 160,
    size: 12,
    font: timesRomanBoldFont,
    color: rgb(1, 1, 1),
  });

  page.drawText(`Issuance Date - ${date}`, {
    x: width / 2 - 70,
    y: 35,
    size: 10,
    font: timesRomanFont,
    color: rgb(1, 1, 1),
  });

  // Authority Signature Name
  page.drawText('Vinaykumar P.', {
    x: 60,
    y: 100,
    size: 24,
    font: timesRomanItalicFont,
    color: rgb(1, 1, 1),
  });
  
  page.drawText('Founder And MD', {
    x: 70,
    y: 80,
    size: 10,
    font: timesRomanFont,
    color: rgb(0.8, 0.8, 0.8),
  });
  page.drawText('Mr. Vinay Kumar P.', {
    x: 70,
    y: 65,
    size: 10,
    font: timesRomanBoldFont,
    color: rgb(1, 1, 1),
  });
  page.drawText('Veagle Space of Technology Pvt. Ltd.', {
    x: 70,
    y: 50,
    size: 9,
    font: timesRomanFont,
    color: rgb(0.8, 0.8, 0.8),
  });


  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};
