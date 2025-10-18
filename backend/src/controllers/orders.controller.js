const dayjs = require('dayjs');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { createNotification } = require('../utils/notifications');
const { logAdminAction } = require('../utils/adminLog');

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
    await Transaction.create({ user: user._id, type: 'order', amount: -price, balanceAfter: user.walletBalance, status: 'success', meta: { orderId: order._id } });
    await createNotification({ userId: user._id, type: 'order', title: 'Order placed', message: `Order ${order._id} placed`, meta: { orderId: order._id } });

    res.json({ ok: true, order });
  } catch (e) { next(e); }
}

async function listOrders(req, res, next) {
  try {
    const { status, from, to } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (from || to) filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
    const orders = await Order.find(filter).populate('service').sort({ createdAt: -1 });
    res.json({ ok: true, orders });
  } catch (e) { next(e); }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('service');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ok: true, order });
  } catch (e) { next(e); }
}

async function reorder(req, res, next) {
  try {
    const prev = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('service');
    if (!prev) return res.status(404).json({ error: 'Order not found' });
    req.body = { serviceId: prev.service._id, linkOrUsername: prev.linkOrUsername, quantity: prev.quantity };
    return placeOrder(req, res, next);
  } catch (e) { next(e); }
}

// Admin status update
async function adminUpdateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pending, Processing, Completed, Partial, Canceled, Refunded
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const prevStatus = order.status;
    order.status = status;
    await order.save();

    // Refund on Canceled/Refunded
    if ((status === 'Canceled' || status === 'Refunded') && (prevStatus !== 'Canceled' && prevStatus !== 'Refunded')) {
      const user = await User.findById(order.user);
      user.walletBalance = Math.round((user.walletBalance + order.price) * 100) / 100;
      await user.save();
      await Transaction.create({ user: user._id, type: 'refund', amount: order.price, balanceAfter: user.walletBalance, meta: { orderId: order._id } });
    }

    await createNotification({ userId: order.user, type: 'order', title: 'Order status updated', message: `Order ${order._id} is ${order.status}` });
    await logAdminAction({ actor: req.user._id, role: req.user.role, action: 'order_status_update', targetType: 'Order', targetId: order._id.toString(), meta: { from: prevStatus, to: status } });
    res.json({ ok: true, order });
  } catch (e) { next(e); }
}

module.exports = { placeOrder, listOrders, getOrder, reorder, adminUpdateStatus };
