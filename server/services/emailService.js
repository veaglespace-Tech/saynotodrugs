import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

export const sendCertificateEmail = async (toEmail, name, pledgeId, pdfBuffer) => {
  try {
    const mailOptions = {
      from: `"Say No To Drugs Campaign" <${config.email.user}>`,
      to: toEmail,
      subject: 'Your Say No to Drugs Pledge Certificate',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Dear ${name},</h2>
          <p>Thank you for taking the Say No to Drugs Pledge.</p>
          <p>Your commitment helps spread awareness and encourages a healthier, safer and drug-free society.</p>
          <p><strong>Pledge ID:</strong> ${pledgeId}</p>
          <p>Your digital pledge certificate is attached.</p>
          <p>Thank you for being part of the campaign.</p>
          <br>
          <p>Say No to Drugs. Say Yes to Life.</p>
        </div>
      `,
      attachments: [
        {
          filename: `certificate-${pledgeId}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
