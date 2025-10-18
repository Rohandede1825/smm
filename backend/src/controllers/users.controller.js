const User = require('../models/User');
const { genApiKey } = require('../utils/crypto');

async function me(req, res, next) {
  try {
    const u = req.user;
    res.json({
      ok: true,
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        walletBalance: u.walletBalance,
        referralBalance: u.referralBalance,
        referralCode: u.referralCode,
        isEmailVerified: u.isEmailVerified,
        apiKey: u.apiKey || null,
      },
    });
  } catch (e) { next(e); }
}

async function updateMe(req, res, next) {
  try {
    const { name, email } = req.body;
    if (email && email !== req.user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already in use' });
      req.user.email = email;
      req.user.isEmailVerified = false; // if email changed
    }
    if (name) req.user.name = name;
    await req.user.save();
    res.json({ ok: true });
  } catch (e) { next(e); }
}

async function generateApiKey(req, res, next) {
  try {
    req.user.apiKey = genApiKey();
    await req.user.save();
    res.json({ ok: true, apiKey: req.user.apiKey });
  } catch (e) { next(e); }
}

module.exports = { me, updateMe, generateApiKey };

