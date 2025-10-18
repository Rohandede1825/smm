const { getNumber } = require('../services/settings.service');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function createWithdrawal(req, res, next) {
  try {
    const { amount, fromBalance = 'main', method = 'upi', account = {} } = req.body;
    const amt = Number(amount);
    const MIN_WITHDRAWAL = await getNumber('MIN_WITHDRAWAL', Number(process.env.MIN_WITHDRAWAL || 100));
    if (!amt || amt < MIN_WITHDRAWAL) return res.status(400).json({ error: `Minimum withdrawal is ₹${MIN_WITHDRAWAL}` });
    const user = await User.findById(req.user._id);
    if (fromBalance === 'main') {
      if (user.walletBalance < amt) return res.status(400).json({ error: 'Insufficient wallet balance' });
      user.walletBalance = Math.round((user.walletBalance - amt) * 100) / 100;
      await user.save();
      await Transaction.create({ user: user._id, type: 'withdrawal', amount: -amt, balanceAfter: user.walletBalance, meta: { from: 'main' } });
    } else {
      if (user.referralBalance < amt) return res.status(400).json({ error: 'Insufficient referral balance' });
      user.referralBalance = Math.round((user.referralBalance - amt) * 100) / 100;
      await user.save();
      await Transaction.create({ user: user._id, type: 'withdrawal', amount: -amt, balanceAfter: user.referralBalance, meta: { from: 'referral' } });
    }
    const w = await Withdrawal.create({ user: user._id, amount: amt, fromBalance, method, account, status: 'Pending' });
    res.json({ ok: true, withdrawal: w });
  } catch (e) { next(e); }
}

async function listWithdrawals(req, res, next) {
  try {
    const list = await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ ok: true, withdrawals: list });
  } catch (e) { next(e); }
}

async function adminList(req, res, next) {
  try {
    const list = await Withdrawal.find().populate('user').sort({ createdAt: -1 });
    res.json({ ok: true, withdrawals: list });
  } catch (e) { next(e); }
}

async function adminUpdateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; // Approved or Rejected
    const w = await Withdrawal.findById(id);
    if (!w) return res.status(404).json({ error: 'Withdrawal not found' });
    if (w.status !== 'Pending') return res.status(400).json({ error: 'Already processed' });
    w.status = status;
    w.reason = reason;
    await w.save();
    if (status === 'Rejected') {
      const user = await User.findById(w.user);
      if (w.fromBalance === 'main') {
        user.walletBalance = Math.round((user.walletBalance + w.amount) * 100) / 100;
        await Transaction.create({ user: user._id, type: 'refund', amount: w.amount, balanceAfter: user.walletBalance, meta: { kind: 'withdrawal_reject' } });
      } else {
        user.referralBalance = Math.round((user.referralBalance + w.amount) * 100) / 100;
        await Transaction.create({ user: user._id, type: 'referral_commission', amount: w.amount, balanceAfter: user.referralBalance, meta: { kind: 'withdrawal_reject' } });
      }
      await user.save();
    }
    res.json({ ok: true, withdrawal: w });
  } catch (e) { next(e); }
}

module.exports = { createWithdrawal, listWithdrawals, adminList, adminUpdateStatus };
