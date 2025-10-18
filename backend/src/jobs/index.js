const Order = require('../models/Order');
const { createNotification } = require('../utils/notifications');

function startJobs() {
  // Simple demo job to auto-progress orders
  setInterval(async () => {
    try {
      const pending = await Order.find({ status: 'Pending', createdAt: { $lt: new Date(Date.now() - 2 * 60 * 1000) } }).limit(20);
      for (const o of pending) {
        o.status = 'Processing';
        await o.save();
        await createNotification({ userId: o.user, type: 'order', title: 'Order processing', message: `Order ${o._id} is Processing` });
      }
      const processing = await Order.find({ status: 'Processing', updatedAt: { $lt: new Date(Date.now() - 3 * 60 * 1000) } }).limit(20);
      for (const o of processing) {
        o.status = 'Completed';
        await o.save();
        await createNotification({ userId: o.user, type: 'order', title: 'Order completed', message: `Order ${o._id} is Completed` });
      }
    } catch (e) {
      console.error('Job error', e.message);
    }
  }, 60 * 1000);
}

module.exports = { startJobs };

