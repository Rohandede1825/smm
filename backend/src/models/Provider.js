const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    baseUrl: { type: String, required: true },
    apiKey: { type: String },
    type: { type: String, enum: ['generic', 'smm'], default: 'generic' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    settings: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);

