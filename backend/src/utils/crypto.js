const crypto = require('crypto');

function genOTP(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return code;
}

function genApiKey() {
  return crypto.randomBytes(24).toString('hex');
}

module.exports = { genOTP, genApiKey };

