const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) {
    console.warn('SMTP not configured; emails will be logged');
    transporter = null;
    return null;
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: false,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return transporter;
}

async function sendMail({ to, subject, html }) {
  const from = process.env.SMTP_FROM || 'no-reply@example.com';
  const t = getTransporter();
  if (!t) {
    console.log('[EMAIL]', { to, subject, html });
    return;
  }
  await t.sendMail({ from, to, subject, html });
}

async function sendOTP(to, code) {
  const subject = 'Your Verification Code';
  const html = `<p>Your one-time verification code is:</p><h2>${code}</h2><p>This code expires in 10 minutes.</p>`;
  return sendMail({ to, subject, html });
}

module.exports = { sendMail, sendOTP };

