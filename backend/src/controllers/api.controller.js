const Service = require('../models/Service');
const Order = require('../models/Order');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function listServices(req, res, next) {
  try {
    const services = await Service.find({ status: 'active' }).select('name pricePer1000 minQty maxQty description');
    res.json({ ok: true, services });
  } catch (e) { next(e); }
}

async function placeOrder(req, res, next) {
  try {
    const { serviceId, linkOrUsername, quantity } = req.body;
    const svc = await Service.findById(serviceId);
    if (!svc || svc.status !== 'active') return res.status(400).json({ error: 'Invalid service' });
    if (quantity < svc.minQty || quantity > svc.maxQty) return res.status(400).json({ error: 'Quantity out of bounds' });
    const price = Math.round(((quantity / 1000) * svc.pricePer1000) * 100) / 100;

    const user = await User.findById(req.user._id);
    if (user.walletBalance < price) return res.status(400).json({ error: 'Insufficient wallet balance' });
    user.walletBalance = Math.round((user.walletBalance - price) * 100) / 100;
    await user.save();
    const order = await Order.create({ user: user._id, service: svc._id, linkOrUsername, quantity, price, status: 'Pending' });
    await Transaction.create({ user: user._id, type: 'order', amount: -price, balanceAfter: user.walletBalance, meta: { orderId: order._id, via: 'api' } });
    res.json({ ok: true, orderId: order._id });
  } catch (e) { next(e); }
}

async function getOrder(req, res, next) {
  try {
    const o = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('service');
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, order: o });
  } catch (e) { next(e); }
}

module.exports = { listServices, placeOrder, getOrder };

