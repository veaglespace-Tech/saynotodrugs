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

  pdfDoc.registerFontkit(fontkit);

  // ============================================================
  // FONTS
  // ============================================================

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

    const templateBytes = fs.readFileSync(
      templatePath
    );

    const templateImage =
      await pdfDoc.embedJpg(templateBytes);

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

  const NAME_Y = 431;

  const MAX_NAME_WIDTH = 350;

  let nameSize = 34;

  let nameWidth =
    nameFont.widthOfTextAtSize(
      name,
      nameSize
    );

  // Automatically reduce font size
  // for long names
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
  // GENERATE QR CODE
  // ============================================================

  const qrDataUrl =
    await QRCode.toDataURL(
      verifyUrl,
      {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
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
  // This position matches the QR location
  // from the reference certificate image.
  //
  // Template size:
  // 1024 x 683
  //
  // QR:
  // X    = 443
  // Y    = 82
  // Size = 65
  //
  // PDF coordinates start from bottom-left.
  //
  // ============================================================

  const QR_X = 443;
  const QR_Y = 82;
  const QR_SIZE = 65;

  page.drawImage(qrImage, {
    x: QR_X,
    y: QR_Y,
    width: QR_SIZE,
    height: QR_SIZE,
  });

  // ============================================================
  // DATE + CERTIFICATE ID
  // ============================================================

  const dateText = `Date: ${date}`;
  const idText = `ID: ${certificateNumber}`;

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

  // Center Date and ID exactly under QR

  const qrCenterX =
    QR_X + QR_SIZE / 2;

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

    y: QR_Y - 26,

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