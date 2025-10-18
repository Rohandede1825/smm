const mongoose = require('mongoose');

const childPanelSchema = new mongoose.Schema(
  {
    reseller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    domain: { type: String, required: true },
    subdomain: { type: String },
    plan: { type: String, enum: ['basic', 'pro', 'enterprise'], default: 'basic' },
    status: { type: String, enum: ['Pending', 'Active', 'Suspended'], default: 'Pending' },
    settings: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChildPanel', childPanelSchema);

