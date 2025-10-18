const ChildPanel = require('../models/ChildPanel');

async function createPanel(req, res, next) {
  try {
    const { domain, subdomain, plan = 'basic' } = req.body;
    const p = await ChildPanel.create({ reseller: req.user._id, domain, subdomain, plan, status: 'Pending' });
    res.json({ ok: true, panel: p });
  } catch (e) { next(e); }
}

async function listPanels(req, res, next) {
  try {
    const list = await ChildPanel.find({ reseller: req.user._id }).sort({ createdAt: -1 });
    res.json({ ok: true, panels: list });
  } catch (e) { next(e); }
}

async function getPanel(req, res, next) {
  try {
    const p = await ChildPanel.findOne({ _id: req.params.id, reseller: req.user._id });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, panel: p });
  } catch (e) { next(e); }
}

// Admin can activate/suspend
async function adminUpdate(req, res, next) {
  try {
    const p = await ChildPanel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true, panel: p });
  } catch (e) { next(e); }
}

module.exports = { createPanel, listPanels, getPanel, adminUpdate };

