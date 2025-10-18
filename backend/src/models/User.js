const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    role: { type: String, enum: ['user', 'admin', 'staff', 'support', 'reseller'], default: 'user' },
    status: { type: String, enum: ['active', 'banned'], default: 'active', index: true },
    bannedAt: { type: Date },
    banReason: { type: String },
    walletBalance: { type: Number, default: 0 },
    referralBalance: { type: Number, default: 0 },
    referralCode: { type: String, unique: true },
    referredBy: { type: String },
    apiKey: { type: String, unique: true, sparse: true },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
