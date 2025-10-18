const Notification = require('../models/Notification');

async function list(req, res, next) {
  try {
    const items = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(200);
    res.json({ ok: true, notifications: items });
  } catch (e) { next(e); }
}

async function markRead(req, res, next) {
  try {
    const n = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!n) return res.status(404).json({ error: 'Not found' });
    n.read = true;
    await n.save();
    res.json({ ok: true });
  } catch (e) { next(e); }
}

module.exports = { list, markRead };

