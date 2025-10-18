const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['deposit', 'order', 'withdrawal', 'referral_commission', 'refund'],
      required: true,
    },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'success' },
    source: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);

