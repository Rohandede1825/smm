const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const Provider = require('../models/Provider');
const ManualPayment = require('../models/ManualPayment');
const WebhookLog = require('../models/WebhookLog');
const Ticket = require('../models/Ticket');
const Setting = require('../models/Setting');
const AdminLog = require('../models/AdminLog');
const { logAdminAction } = require('../utils/adminLog');
const PDFDocument = require('pdfkit');

async function overview(req, res, next) {
  try {
    const [users, orders, deposits] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Transaction.aggregate([{ $match: { type: 'deposit', status: 'success' } }, { $group: { _id: null, sum: { $sum: '$amount' } } }]),
    ]);
    res.json({ ok: true, users, orders, totalDeposits: deposits?.[0]?.sum || 0 });
  } catch (e) { next(e); }
}

async function analytics(req, res, next) {
  try {
    const { days = 7 } = req.query;
    const since = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);
    const group = { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } };
    const sumGroup = { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, sum: { $sum: '$amount' } } };
    const [usersDaily, ordersDaily, depositsDaily] = await Promise.all([
      User.aggregate([{ $match: { createdAt: { $gte: since } } }, group, { $sort: { _id: 1 } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: since } } }, group, { $sort: { _id: 1 } }]),
      Transaction.aggregate([{ $match: { createdAt: { $gte: since }, type: 'deposit', status: 'success' } }, sumGroup, { $sort: { _id: 1 } }]),
    ]);
    res.json({ ok: true, usersDaily, ordersDaily, depositsDaily });
  } catch (e) { next(e); }
}

async function listUsers(req, res, next) {
  try {
    const { q, status, role } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    if (q) filter.$or = [ { name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } } ];
    const list = await User.find(filter).select('name email role status walletBalance referralBalance createdAt referralCode').sort({ createdAt: -1 }).limit(1000);
    res.json({ ok: true, users: list });
  } catch (e) { next(e); }
}

async function userDetails(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const [orders, transactions] = await Promise.all([
      Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(200),
      Transaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(200),
    ]);
    res.json({ ok: true, user, orders, transactions });
  } catch (e) { next(e); }
}

async function updateUserRole(req, res, next) {
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!u) return res.status(404).json({ error: 'User not found' });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'update_role', targetType: 'User', targetId: u._id.toString(), meta: { role: req.body.role } });
    res.json({ ok: true, user: u });
  } catch (e) { next(e); }
}

async function updateUserStatus(req, res, next) {
  try {
    const { status, reason } = req.body; // active|banned
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    u.status = status;
    u.banReason = status === 'banned' ? reason : undefined;
    u.bannedAt = status === 'banned' ? new Date() : undefined;
    await u.save();
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'update_user_status', targetType: 'User', targetId: u._id.toString(), meta: { status } });
    res.json({ ok: true, user: u });
  } catch (e) { next(e); }
}

async function adjustWallet(req, res, next) {
  try {
    const { amount, balance = 'wallet', reason } = req.body; // balance: wallet|referral
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    const amt = Number(amount);
    if (!amt) return res.status(400).json({ error: 'Invalid amount' });
    if (balance === 'wallet') {
      u.walletBalance = Math.round((u.walletBalance + amt) * 100) / 100;
      await u.save();
      await Transaction.create({ user: u._id, type: amt >= 0 ? 'deposit' : 'withdrawal', amount: amt, balanceAfter: u.walletBalance, status: 'success', meta: { reason, admin: true } });
    } else {
      u.referralBalance = Math.round((u.referralBalance + amt) * 100) / 100;
      await u.save();
      await Transaction.create({ user: u._id, type: 'referral_commission', amount: amt, balanceAfter: u.referralBalance, status: 'success', meta: { reason, admin: true } });
    }
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'adjust_wallet', targetType: 'User', targetId: u._id.toString(), meta: { amount: amt, balance, reason } });
    res.json({ ok: true, user: u });
  } catch (e) { next(e); }
}

async function listOrders(req, res, next) {
  try {
    const { status, service } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (service) filter.service = service;
    const list = await Order.find(filter).populate('user service').sort({ createdAt: -1 }).limit(1000);
    res.json({ ok: true, orders: list });
  } catch (e) { next(e); }
}

async function manualOrder(req, res, next) {
  try {
    const { userId, serviceId, linkOrUsername, quantity, chargeWallet = false } = req.body;
    const user = await User.findById(userId);
    const svc = await Service.findById(serviceId);
    if (!user || !svc) return res.status(400).json({ error: 'Invalid user or service' });
    const price = Math.round(((quantity / 1000) * svc.pricePer1000) * 100) / 100;
    if (chargeWallet && user.walletBalance < price) return res.status(400).json({ error: 'Insufficient user wallet balance' });
    if (chargeWallet) {
      user.walletBalance = Math.round((user.walletBalance - price) * 100) / 100;
      await user.save();
      await Transaction.create({ user: user._id, type: 'order', amount: -price, balanceAfter: user.walletBalance, meta: { manual: true } });
    }
    const o = await Order.create({ user: user._id, service: svc._id, linkOrUsername, quantity, price, status: 'Pending', notes: 'Manual by admin' });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'manual_order', targetType: 'Order', targetId: o._id.toString(), meta: { userId, serviceId } });
    res.json({ ok: true, order: o });
  } catch (e) { next(e); }
}

async function listTransactions(req, res, next) {
  try {
    const list = await Transaction.find().populate('user').sort({ createdAt: -1 }).limit(500);
    res.json({ ok: true, transactions: list });
  } catch (e) { next(e); }
}

async function listWithdrawals(req, res, next) {
  try {
    const list = await Withdrawal.find().populate('user').sort({ createdAt: -1 }).limit(500);
    res.json({ ok: true, withdrawals: list });
  } catch (e) { next(e); }
}

// Services
async function deleteService(req, res, next) {
  try {
    await Service.findByIdAndDelete(req.params.id);
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'delete_service', targetType: 'Service', targetId: req.params.id });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

async function linkServiceProvider(req, res, next) {
  try {
    const svc = await Service.findByIdAndUpdate(req.params.id, { provider: req.body.providerId, providerServiceId: req.body.providerServiceId, providerRatePer1000: req.body.providerRatePer1000 }, { new: true });
    if (!svc) return res.status(404).json({ error: 'Service not found' });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'link_service_provider', targetType: 'Service', targetId: svc._id.toString(), meta: { providerId: req.body.providerId } });
    res.json({ ok: true, service: svc });
  } catch (e) { next(e); }
}

// Providers
async function listProviders(req, res, next) {
  try {
    const providers = await Provider.find().sort({ createdAt: -1 });
    res.json({ ok: true, providers });
  } catch (e) { next(e); }
}

async function createProvider(req, res, next) {
  try {
    const p = await Provider.create({ name: req.body.name, baseUrl: req.body.baseUrl, apiKey: req.body.apiKey, type: req.body.type || 'generic', status: req.body.status || 'active', settings: req.body.settings || {} });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'create_provider', targetType: 'Provider', targetId: p._id.toString() });
    res.json({ ok: true, provider: p });
  } catch (e) { next(e); }
}

async function updateProvider(req, res, next) {
  try {
    const p = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'update_provider', targetType: 'Provider', targetId: p._id.toString() });
    res.json({ ok: true, provider: p });
  } catch (e) { next(e); }
}

async function deleteProvider(req, res, next) {
  try {
    await Provider.findByIdAndDelete(req.params.id);
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'delete_provider', targetType: 'Provider', targetId: req.params.id });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// Manual payments
async function listManualPayments(req, res, next) {
  try {
    const list = await ManualPayment.find().populate('user reviewedBy').sort({ createdAt: -1 });
    res.json({ ok: true, manualPayments: list });
  } catch (e) { next(e); }
}

async function createManualPayment(req, res, next) {
  try {
    const mp = await ManualPayment.create({ user: req.body.userId, amount: req.body.amount, method: req.body.method || 'upi', reference: req.body.reference, status: 'Pending', notes: req.body.notes });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'create_manual_payment', targetType: 'ManualPayment', targetId: mp._id.toString() });
    res.json({ ok: true, manualPayment: mp });
  } catch (e) { next(e); }
}

async function reviewManualPayment(req, res, next) {
  try {
    const { status } = req.body; // Approved/Rejected
    const mp = await ManualPayment.findById(req.params.id);
    if (!mp) return res.status(404).json({ error: 'Not found' });
    if (mp.status !== 'Pending') return res.status(400).json({ error: 'Already reviewed' });
    mp.status = status;
    mp.reviewedBy = req.user._id;
    await mp.save();
    if (status === 'Approved') {
      const user = await User.findById(mp.user);
      user.walletBalance = Math.round((user.walletBalance + mp.amount) * 100) / 100;
      await user.save();
      await Transaction.create({ user: user._id, type: 'deposit', amount: mp.amount, balanceAfter: user.walletBalance, status: 'success', meta: { manual: true, mp: mp._id } });
    }
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'review_manual_payment', targetType: 'ManualPayment', targetId: mp._id.toString(), meta: { status } });
    res.json({ ok: true, manualPayment: mp });
  } catch (e) { next(e); }
}

// Webhook logs
async function listWebhookLogs(req, res, next) {
  try {
    const list = await WebhookLog.find().sort({ createdAt: -1 }).limit(1000);
    res.json({ ok: true, logs: list });
  } catch (e) { next(e); }
}

// Tickets
async function adminTickets(req, res, next) {
  try {
    const list = await Ticket.find().populate('user').sort({ updatedAt: -1 }).limit(1000);
    res.json({ ok: true, tickets: list });
  } catch (e) { next(e); }
}

// Settings
async function getSettings(req, res, next) {
  try {
    const items = await Setting.find().sort({ key: 1 });
    res.json({ ok: true, settings: items });
  } catch (e) { next(e); }
}

async function setSettings(req, res, next) {
  try {
    const entries = req.body || {};
    await Promise.all(Object.entries(entries).map(([key, value]) => Setting.findOneAndUpdate({ key }, { value }, { upsert: true })));
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'set_settings' });
    res.json({ ok: true });
  } catch (e) { next(e); }
}

// Reports (CSV / PDF)
function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? '')).join(','))].join('\n');
}

async function exportReport(req, res, next) {
  try {
    const { type = 'orders', format = 'csv', from, to } = req.query;
    const range = {};
    if (from || to) range.createdAt = {};
    if (from) range.createdAt.$gte = new Date(from);
    if (to) range.createdAt.$lte = new Date(to);
    if (format === 'csv') {
      if (type === 'orders') {
        const items = await Order.find(range).populate('user service').lean();
        const rows = items.map(o => ({ id: o._id, user: o.user?.email, service: o.service?.name, qty: o.quantity, status: o.status, price: o.price, createdAt: o.createdAt }));
        const csv = toCSV(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
        return res.send(csv);
      }
      if (type === 'payments') {
        const items = await Transaction.find({ type: 'deposit', status: 'success', ...range }).populate('user').lean();
        const rows = items.map(t => ({ id: t._id, user: t.user?.email, amount: t.amount, createdAt: t.createdAt }));
        const csv = toCSV(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="payments.csv"');
        return res.send(csv);
      }
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.pdf"`);
      doc.pipe(res);
      doc.fontSize(18).text(`Report: ${type}`, { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`Range: ${from || 'start'} – ${to || 'now'}`);
      doc.moveDown();
      if (type === 'orders') {
        const items = await Order.find(range).limit(500).lean();
        items.forEach(o => doc.text(`${o._id} | status=${o.status} | price=${o.price} | ${o.createdAt}`));
      } else if (type === 'payments') {
        const items = await Transaction.find({ type: 'deposit', status: 'success', ...range }).limit(500).lean();
        items.forEach(t => doc.text(`${t._id} | amount=${t.amount} | ${t.createdAt}`));
      }
      doc.end();
      return;
    }
    res.status(400).json({ error: 'Unsupported report request' });
  } catch (e) { next(e); }
}

// Admin logs
async function listAdminLogs(req, res, next) {
  try {
    const logs = await AdminLog.find().populate('actor').sort({ createdAt: -1 }).limit(1000);
    res.json({ ok: true, logs });
  } catch (e) { next(e); }
}

module.exports = { overview, analytics, listUsers, userDetails, updateUserRole, updateUserStatus, adjustWallet, listOrders, manualOrder, listTransactions, listWithdrawals, deleteService, linkServiceProvider, listProviders, createProvider, updateProvider, deleteProvider, listManualPayments, createManualPayment, reviewManualPayment, listWebhookLogs, adminTickets, getSettings, setSettings, exportReport, listAdminLogs };
