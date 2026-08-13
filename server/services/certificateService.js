// import 'regenerator-runtime/runtime.js';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import fontkit from '@pdf-lib/fontkit';
// import QRCode from 'qrcode';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const generateCertificate = async (name, certificateNumber, date, language = 'english', config) => {
//   // Create a new PDFDocument
//   const pdfDoc = await PDFDocument.create();

//   // Register fontkit
//   pdfDoc.registerFontkit(fontkit);

//   // Load standard fonts
//   const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
//   const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

//   // Load Devanagari font (always used for Name to prevent box rendering issues)
//   let customFont = timesRomanFont; // fallback
//   try {
//     const fontBytes = fs.readFileSync(path.join(__dirname, '../fonts/NotoSansDevanagari-Regular.ttf'));
//     customFont = await pdfDoc.embedFont(fontBytes);
//   } catch (err) {
//     console.error('Could not load custom font, falling back to standard font.', err);
//   }

//   // The full image is landscape. Typical size 1024x683
//   const width = 1024;
//   const height = 683;
//   const page = pdfDoc.addPage([width, height]);

//   // Load the full JPEG certificate template
//   try {
//     const templatePath = path.join(__dirname, '../assets/certificate_full.jpg');
//     if (fs.existsSync(templatePath)) {
//       const templateBytes = fs.readFileSync(templatePath);
//       const templateImage = await pdfDoc.embedJpg(templateBytes);

//       // Draw template to cover the entire page
//       page.drawImage(templateImage, {
//         x: 0,
//         y: 0,
//         width: width,
//         height: height,
//       });
//     } else {
//         throw new Error('Full certificate image not found in assets');
//     }
//   } catch (err) {
//     console.error('Template image not found or could not be loaded.', err);
//     page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.95, 0.95, 0.95) });
//   }

//   // The certificate section is on the right half. (x: 512 to 1024)
//   // The visual center of the certificate is slightly shifted, around 785
//   const certCenterX = 785; // Visually centered with the certificate template

//   // Name - Centered vertically around the blank space below "PROUDLY PRESENTED TO"
//   // Assuming "PROUDLY PRESENTED TO" is around y = 480, we place name around y = 430
//   const isDevanagari = /[\u0900-\u097F]/.test(name);
//   const nameFont = isDevanagari ? customFont : timesRomanBoldFont;
//   const nameSize = 34;
//   const nameWidth = nameFont.widthOfTextAtSize(name, nameSize);

//   page.drawText(name, {
//     x: certCenterX - (nameWidth / 2),
//     y: height * 0.62, // ~423
//     size: nameSize,
//     font: nameFont,
//     color: rgb(0.1, 0.2, 0.4), // Dark Blue to match theme
//   });

//   // Verification QR Code
//   const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify/${certificateNumber}`; 
//   const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, color: { dark: '#0a192f', light: '#ffffff' } });
//   const qrImageBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
//   const qrImage = await pdfDoc.embedPng(qrImageBytes);

//   const qrSize = 85;

//   // Position QR Code at bottom right of the certificate half
//   const certRightX = 885;
//   const bottomY = 85;

//   page.drawImage(qrImage, {
//     x: certRightX,
//     y: bottomY,
//     width: qrSize,
//     height: qrSize,
//   });

//   // Date and Certificate ID below QR code, drawn in dark blue so it is visible on the cream background
//   const dateStr = `Date: ${date}`;
//   const idStr = `ID: ${certificateNumber}`;
//   const dateWidth = timesRomanBoldFont.widthOfTextAtSize(dateStr, 10);
//   const idWidth = timesRomanBoldFont.widthOfTextAtSize(idStr, 10);

//   const qrCenterX = certRightX + (qrSize / 2);

//   page.drawText(dateStr, {
//     x: qrCenterX - (dateWidth / 2),
//     y: bottomY - 14,
//     size: 10,
//     font: timesRomanBoldFont,
//     color: rgb(0.1, 0.2, 0.4),
//   });

//   page.drawText(idStr, {
//     x: qrCenterX - (idWidth / 2),
//     y: bottomY - 26,
//     size: 10,
//     font: timesRomanBoldFont,
//     color: rgb(0.1, 0.2, 0.4),
//   });

//   // Serialize the PDFDocument to bytes
//   const pdfBytes = await pdfDoc.save();
//   return Buffer.from(pdfBytes);
// };


import 'regenerator-runtime/runtime.js';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (
  name,
  certificateNumber,
  date,
  language = 'english',
  config = {}
) => {
  // ============================================================
  // PDF SETUP
  // ============================================================

  const pdfDoc = await PDFDocument.create();

  // Required for custom TTF fonts
  pdfDoc.registerFontkit(fontkit);

  // Standard fonts
  const timesRomanFont = await pdfDoc.embedFont(
    StandardFonts.TimesRoman
  );

  const timesRomanBoldFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBold
  );

  // ============================================================
  // DEVANAGARI FONT
  // ============================================================

  let customFont = timesRomanFont;

  try {
    const fontPath = path.join(
      __dirname,
      '../fonts/NotoSansDevanagari-Regular.ttf'
    );

    if (fs.existsSync(fontPath)) {
      const fontBytes = fs.readFileSync(fontPath);
      customFont = await pdfDoc.embedFont(fontBytes);
    } else {
      console.warn(
        'NotoSansDevanagari-Regular.ttf not found. Using fallback font.'
      );
    }
  } catch (error) {
    console.error(
      'Could not load Devanagari font:',
      error
    );
  }

  // ============================================================
  // PAGE SIZE
  // ============================================================

  const width = 1024;
  const height = 683;

  const page = pdfDoc.addPage([
    width,
    height,
  ]);

  // ============================================================
  // LOAD CERTIFICATE TEMPLATE
  // ============================================================

  const templatePath = path.join(
    __dirname,
    '../assets/certificate_full.jpg'
  );

  try {
    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Certificate template not found: ${templatePath}`
      );
    }

    const templateBytes =
      fs.readFileSync(templatePath);

    const templateImage =
      await pdfDoc.embedJpg(templateBytes);

    // Full template background
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  } catch (error) {
    console.error(
      'Template image could not be loaded:',
      error
    );

    // Fallback background
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(
        0.95,
        0.95,
        0.95
      ),
    });
  }

  // ============================================================
  // CERTIFICATE AREA
  // ============================================================
  //
  // The uploaded template is 1024 x 683.
  //
  // Left side:
  //   Pledge content
  //
  // Right side:
  //   Certificate
  //
  // The right certificate panel visually starts around x=400
  // and ends around x=1015.
  //
  // Actual visual center:
  //   ~707
  //
  // ============================================================

  const CERT_LEFT = 400;
  const CERT_RIGHT = 1015;

  const CERT_CENTER_X =
    CERT_LEFT +
    (CERT_RIGHT - CERT_LEFT) / 2;

  // ============================================================
  // NAME
  // ============================================================

  const isDevanagari =
    /[\u0900-\u097F]/.test(name);

  const nameFont = isDevanagari
    ? customFont
    : timesRomanBoldFont;

  /*
   * IMPORTANT:
   *
   * PDF coordinate system starts from bottom-left.
   *
   * In the original code:
   *
   *   y = height * 0.62
   *
   * the name was ending up too low / misaligned.
   *
   * New position places the name between:
   *
   *   PROUDLY PRESENTED TO
   *
   * and
   *
   *   horizontal decorative line
   */

  const NAME_Y = 431;

  /*
   * Maximum width available for the name.
   *
   * This prevents long names from touching
   * the decorative borders.
   */

  const MAX_NAME_WIDTH = 350;

  /*
   * Start with 34pt.
   */

  let nameSize = 34;

  let nameWidth =
    nameFont.widthOfTextAtSize(
      name,
      nameSize
    );

  /*
   * Automatically reduce font size
   * for long names.
   */

  while (
    nameWidth > MAX_NAME_WIDTH &&
    nameSize > 20
  ) {
    nameSize -= 1;

    nameWidth =
      nameFont.widthOfTextAtSize(
        name,
        nameSize
      );
  }

  /*
   * Final centered X position.
   */

  const nameX =
    CERT_CENTER_X -
    nameWidth / 2;

  page.drawText(name, {
    x: nameX,
    y: NAME_Y,
    size: nameSize,
    font: nameFont,
    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // VERIFICATION URL
  // ============================================================

  const clientUrl =
    process.env.CLIENT_URL ||
    'http://localhost:3000';

  const verifyUrl =
    `${clientUrl}/verify/${certificateNumber}`;

  // ============================================================
  // QR CODE
  // ============================================================

  const qrDataUrl =
    await QRCode.toDataURL(
      verifyUrl,
      {
        margin: 1,

        // High error correction makes the QR
        // more reliable when printed.
        errorCorrectionLevel: 'H',

        color: {
          dark: '#0a192f',
          light: '#ffffff',
        },
      }
    );

  const qrImageBytes =
    Buffer.from(
      qrDataUrl.split(',')[1],
      'base64'
    );

  const qrImage =
    await pdfDoc.embedPng(
      qrImageBytes
    );

  // ============================================================
  // QR POSITION
  // ============================================================
  //
  // IMPORTANT:
  //
  // The CEO signature is already part of
  // certificate_full.jpg.
  //
  // Original QR:
  //
  //   x = 885
  //   y = 85
  //
  // This overlaps the signature.
  //
  // New QR is moved to the empty area
  // LEFT of the signature.
  //
  // ============================================================

  const QR_SIZE = 62;

  const QR_X = 755;
  const QR_Y = 83;

  page.drawImage(qrImage, {
    x: QR_X,
    y: QR_Y,
    width: QR_SIZE,
    height: QR_SIZE,
  });

  // ============================================================
  // DATE + CERTIFICATE ID
  // ============================================================

  const dateText =
    `Date: ${date}`;

  const idText =
    `ID: ${certificateNumber}`;

  const META_FONT_SIZE = 9;

  const dateWidth =
    timesRomanBoldFont.widthOfTextAtSize(
      dateText,
      META_FONT_SIZE
    );

  const idWidth =
    timesRomanBoldFont.widthOfTextAtSize(
      idText,
      META_FONT_SIZE
    );

  /*
   * Center Date + ID under QR.
   */

  const qrCenterX =
    QR_X +
    QR_SIZE / 2;

  // ============================================================
  // DATE
  // ============================================================

  page.drawText(dateText, {
    x:
      qrCenterX -
      dateWidth / 2,

    y: QR_Y - 13,

    size: META_FONT_SIZE,

    font: timesRomanBoldFont,

    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // CERTIFICATE ID
  // ============================================================

  page.drawText(idText, {
    x:
      qrCenterX -
      idWidth / 2,

    y: QR_Y - 25,

    size: META_FONT_SIZE,

    font: timesRomanBoldFont,

    color: rgb(
      0.08,
      0.16,
      0.28
    ),
  });

  // ============================================================
  // SAVE PDF
  // ============================================================

  const pdfBytes =
    await pdfDoc.save();

  return Buffer.from(
    pdfBytes
  );
};