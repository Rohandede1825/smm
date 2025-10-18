const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

function apiKeyAuth() {
  return async (req, res, next) => {
    try {
      const apiKey = req.headers['x-api-key'];
      if (!apiKey) return res.status(401).json({ error: 'API key missing' });
      const user = await User.findOne({ apiKey });
      if (!user) return res.status(401).json({ error: 'Invalid API key' });
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
}

function requireVerified(req, res, next) {
  if (process.env.ENABLE_EMAIL_VERIFICATION === 'true' && !req.user.isEmailVerified) {
    return res.status(403).json({ error: 'Email not verified' });
  }
  next();
}

function requireActive(req, res, next) {
  if (req.user?.status === 'banned') return res.status(403).json({ error: 'Account banned' });
  next();
}

module.exports = { auth, apiKeyAuth, requireVerified, requireActive };
