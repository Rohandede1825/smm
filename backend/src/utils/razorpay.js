const Razorpay = require('razorpay');
const crypto = require('crypto');

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error('Razorpay keys missing');
  return new Razorpay({ key_id, key_secret });
}

async function createOrder({ amountInPaise, currency = 'INR', receipt }) {
  const rzp = getRazorpay();
  // Razorpay limits receipt length to 40 characters
  const safeReceipt = (receipt ? String(receipt) : '').slice(0, 40) || undefined;
  const order = await rzp.orders.create({ amount: amountInPaise, currency, receipt: safeReceipt, payment_capture: 1 });
  return order;
}

function verifyWebhookSignature(body, signature, secret) {
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
}

module.exports = { getRazorpay, createOrder, verifyWebhookSignature };
