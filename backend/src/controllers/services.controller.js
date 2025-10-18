const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');

async function listCategories(req, res, next) {
  try {
    const cats = await ServiceCategory.find().sort({ name: 1 });
    res.json({ ok: true, categories: cats });
  } catch (e) { next(e); }
}

async function listServices(req, res, next) {
  try {
    const { q, category } = req.query;
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (q) filter.name = { $regex: new RegExp(q, 'i') };
    const services = await Service.find(filter).populate('category');
    res.json({ ok: true, services });
  } catch (e) { next(e); }
}

async function getService(req, res, next) {
  try {
    const { id } = req.params;
    const svc = await Service.findById(id).populate('category');
    if (!svc) return res.status(404).json({ error: 'Service not found' });
    res.json({ ok: true, service: svc });
  } catch (e) { next(e); }
}

// Admin
async function createCategory(req, res, next) {
  try {
    const cat = await ServiceCategory.create({ name: req.body.name, slug: req.body.slug, description: req.body.description });
    res.json({ ok: true, category: cat });
  } catch (e) { next(e); }
}

async function createService(req, res, next) {
  try {
    const svc = await Service.create({
      name: req.body.name,
      category: req.body.category,
      pricePer1000: req.body.pricePer1000,
      minQty: req.body.minQty,
      maxQty: req.body.maxQty,
      description: req.body.description,
      status: req.body.status || 'active',
    });
    res.json({ ok: true, service: svc });
  } catch (e) { next(e); }
}

async function updateService(req, res, next) {
  try {
    const { id } = req.params;
    const svc = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!svc) return res.status(404).json({ error: 'Service not found' });
    res.json({ ok: true, service: svc });
  } catch (e) { next(e); }
}

module.exports = { listCategories, listServices, getService, createCategory, createService, updateService };

