const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    pricePer1000: { type: Number, required: true },
    minQty: { type: Number, required: true },
    maxQty: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    providerServiceId: { type: String },
    providerRatePer1000: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
