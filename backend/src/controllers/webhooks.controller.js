const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { verifyWebhookSignature } = require('../utils/razorpay');
const { createNotification } = require('../utils/notifications');
const { getNumber } = require('../services/settings.service');
const WebhookLog = require('../models/WebhookLog');

async function razorpayWebhook(req, res, next) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const bodyStr = req.bodyRaw; // set in route middleware
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const verified = verifyWebhookSignature(bodyStr, signature, secret);
    await WebhookLog.create({ provider: 'razorpay', endpoint: 'webhooks/razorpay', signature, payload: JSON.parse(bodyStr), ok: verified, message: verified ? 'verified' : 'invalid_signature' });
    if (!verified) return res.status(400).json({ error: 'Invalid signature' });

    const evt = JSON.parse(bodyStr);
    const orderId = evt?.payload?.payment?.entity?.order_id || evt?.payload?.order?.entity?.id || evt?.payload?.order?.entity?.order_id;
    const paymentStatus = evt?.payload?.payment?.entity?.status;

    if (!orderId) return res.json({ ok: true });

    // Find pending deposit transaction and finalize
    const txn = await Transaction.findOne({ source: orderId, type: 'deposit', status: 'pending' });
    if (!txn) return res.json({ ok: true });

    if (paymentStatus === 'captured' || paymentStatus === 'authorized' || evt.event?.includes('order.paid')) {
      txn.status = 'success';
      await txn.save();

      const user = await User.findById(txn.user);
      user.walletBalance = Math.round((user.walletBalance + txn.amount) * 100) / 100;
      await user.save();

      // Update balanceAfter on the original txn
      txn.balanceAfter = user.walletBalance;
      await txn.save();
      await createNotification({ userId: user._id, type: 'payment', title: 'Deposit credited', message: `₹${txn.amount} added to wallet` });

      // Referral commission
      if (user.referredBy) {
        const referrer = await User.findOne({ referralCode: user.referredBy });
        if (referrer) {
          const percent = await getNumber('REFERRAL_COMMISSION_PERCENT', Number(process.env.REFERRAL_COMMISSION_PERCENT || 5));
          const commission = Math.round((txn.amount * percent / 100) * 100) / 100;
          referrer.referralBalance = Math.round((referrer.referralBalance + commission) * 100) / 100;
          await referrer.save();
          await Transaction.create({ user: referrer._id, type: 'referral_commission', amount: commission, balanceAfter: referrer.referralBalance, meta: { referredUser: user._id } });
          await createNotification({ userId: referrer._id, type: 'referral', title: 'Referral commission', message: `You earned ₹${commission} from a referral deposit` });
        }
      }
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}

module.exports = { razorpayWebhook };
