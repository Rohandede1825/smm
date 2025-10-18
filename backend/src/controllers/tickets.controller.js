const Ticket = require('../models/Ticket');

async function createTicket(req, res, next) {
  try {
    const { subject, message } = req.body;
    const t = await Ticket.create({ user: req.user._id, subject, messages: [{ sender: req.user._id, role: 'user', body: message }] });
    res.json({ ok: true, ticket: t });
  } catch (e) { next(e); }
}

async function listTickets(req, res, next) {
  try {
    const list = await Ticket.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ ok: true, tickets: list });
  } catch (e) { next(e); }
}

async function replyTicket(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const t = await Ticket.findOne({ _id: id, user: req.user._id });
    if (!t) return res.status(404).json({ error: 'Ticket not found' });
    t.messages.push({ sender: req.user._id, role: 'user', body: message });
    t.updatedAt = new Date();
    await t.save();
    res.json({ ok: true, ticket: t });
  } catch (e) { next(e); }
}

// Admin: reply/close
async function adminReply(req, res, next) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const t = await Ticket.findById(id);
    if (!t) return res.status(404).json({ error: 'Ticket not found' });
    t.messages.push({ role: 'admin', body: message });
    t.updatedAt = new Date();
    await t.save();
    res.json({ ok: true, ticket: t });
  } catch (e) { next(e); }
}

async function adminClose(req, res, next) {
  try {
    const t = await Ticket.findById(req.params.id);
    if (!t) return res.status(404).json({ error: 'Ticket not found' });
    t.status = 'Closed';
    await t.save();
    res.json({ ok: true, ticket: t });
  } catch (e) { next(e); }
}

module.exports = { createTicket, listTickets, replyTicket, adminReply, adminClose };

