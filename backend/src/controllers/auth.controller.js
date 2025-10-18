const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
const dayjs = require('dayjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { sendOTP } = require('../utils/mailer');
const { genOTP } = require('../utils/crypto');

function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

async function register(req, res, next) {
  try {
    const { name, email, password, referral } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const referralCode = nanoid(8);
    const user = await User.create({ name, email, passwordHash, referralCode, referredBy: referral || null });

    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true') {
      const code = genOTP(6);
      user.otpCode = code;
      user.otpExpiresAt = dayjs().add(10, 'minute').toDate();
      await user.save();
      await sendOTP(user.email, code);
      return res.json({ ok: true, message: 'Registered. Please verify email via OTP.' });
    } else {
      user.isEmailVerified = true;
      await user.save();
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt: dayjs().add(30, 'day').toDate() });
    res.json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.status === 'banned') return res.status(403).json({ error: 'Account banned' });
    if (process.env.ENABLE_EMAIL_VERIFICATION === 'true' && !user.isEmailVerified) {
      return res.status(403).json({ error: 'Email not verified' });
    }
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt: dayjs().add(30, 'day').toDate() });
    res.json({
      ok: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (e) { next(e); }
}

async function verifyEmail(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });
    if (user.isEmailVerified) return res.json({ ok: true, message: 'Already verified' });
    if (!user.otpCode || !user.otpExpiresAt) return res.status(400).json({ error: 'No OTP found' });
    if (user.otpCode !== code) return res.status(400).json({ error: 'Invalid code' });
    if (dayjs(user.otpExpiresAt).isBefore(dayjs())) return res.status(400).json({ error: 'Code expired' });
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    res.json({ ok: true, message: 'Email verified' });
  } catch (e) { next(e); }
}

async function resendOtp(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });
    if (user.isEmailVerified) return res.json({ ok: true, message: 'Already verified' });
    const code = genOTP(6);
    user.otpCode = code;
    user.otpExpiresAt = dayjs().add(10, 'minute').toDate();
    await user.save();
    await sendOTP(user.email, code);
    res.json({ ok: true, message: 'OTP sent' });
  } catch (e) { next(e); }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) return res.status(401).json({ error: 'Invalid refresh' });
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Invalid refresh' });
    const accessToken = signAccessToken(user);
    res.json({ ok: true, accessToken });
  } catch (e) { next(e); }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: true, message: 'If account exists, OTP sent' });
    const code = genOTP(6);
    user.otpCode = code;
    user.otpExpiresAt = dayjs().add(10, 'minute').toDate();
    await user.save();
    await sendOTP(user.email, code);
    res.json({ ok: true, message: 'OTP sent if account exists' });
  } catch (e) { next(e); }
}

async function resetPassword(req, res, next) {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email' });
    if (!user.otpCode || !user.otpExpiresAt) return res.status(400).json({ error: 'No reset code' });
    if (user.otpCode !== code) return res.status(400).json({ error: 'Invalid code' });
    if (dayjs(user.otpExpiresAt).isBefore(dayjs())) return res.status(400).json({ error: 'Code expired' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    res.json({ ok: true, message: 'Password updated' });
  } catch (e) { next(e); }
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendOtp,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
