const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema(
  {
    provider: { type: String },
    endpoint: { type: String },
    signature: { type: String },
    payload: { type: Object },
    ok: { type: Boolean, default: false },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebhookLog', webhookLogSchema);

