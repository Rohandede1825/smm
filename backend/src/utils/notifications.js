const Notification = require('../models/Notification');

async function createNotification({ userId, type, title, message, meta }) {
  const notif = await Notification.create({ user: userId, type, title, message, meta });
  return notif;
}

module.exports = { createNotification };

