const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String },
    action: { type: String, required: true },
    targetType: { type: String },
    targetId: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);

