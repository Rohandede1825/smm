const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function myReferral(req, res, next) {
  try {
    const u = await User.findById(req.user._id);
    res.json({ ok: true, referralCode: u.referralCode, referralBalance: u.referralBalance });
  } catch (e) { next(e); }
}

async function withdrawToWallet(req, res, next) {
  try {
    const u = await User.findById(req.user._id);
    const amount = Number(req.body.amount || u.referralBalance);
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    if (amount > u.referralBalance) return res.status(400).json({ error: 'Insufficient referral balance' });
    u.referralBalance = Math.round((u.referralBalance - amount) * 100) / 100;
    u.walletBalance = Math.round((u.walletBalance + amount) * 100) / 100;
    await u.save();
    await Transaction.create({ user: u._id, type: 'referral_commission', amount: -amount, balanceAfter: u.referralBalance, meta: { move: 'to_wallet' } });
    await Transaction.create({ user: u._id, type: 'deposit', amount, balanceAfter: u.walletBalance, meta: { from: 'referral' } });
    res.json({ ok: true, referralBalance: u.referralBalance, walletBalance: u.walletBalance });
  } catch (e) { next(e); }
}

module.exports = { myReferral, withdrawToWallet };

