const dayjs = require('dayjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { createOrder } = require('../utils/razorpay');

async function listTransactions(req, res, next) {
  try {
    const items = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json({ ok: true, transactions: items });
  } catch (e) { next(e); }
}

async function createDepositOrder(req, res, next) {
  try {
    const { amount } = req.body; // in INR
    const amt = Number(amount);
    if (!amt || amt < 1) return res.status(400).json({ error: 'Invalid amount' });
    const amountInPaise = Math.round(amt * 100);
    // Razorpay enforces a max 40 character receipt; keep it compact
    const receipt = `dep_${Date.now().toString(36)}_${(req.user._id || '').toString().slice(-6)}`;
    const order = await createOrder({ amountInPaise, currency: 'INR', receipt });
    // Record pending transaction; mark success on webhook
    await Transaction.create({ user: req.user._id, type: 'deposit', amount: amt, status: 'pending', source: order.id, meta: { order } });
    res.json({ ok: true, provider: 'razorpay', order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (e) {
    // Provide clearer feedback when Razorpay credentials/config are invalid
    if (e && (e.statusCode || e.error)) {
      const status = e.statusCode || 400;
      const message = (e.error && (e.error.description || e.error.error || e.error.message)) || e.message || 'Payment provider error';
      return res.status(status).json({ error: message });
    }
    next(e);
  }
}

module.exports = { listTransactions, createDepositOrder };
