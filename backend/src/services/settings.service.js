const Setting = require('../models/Setting');

const cache = new Map();
const TTL = 30 * 1000; // 30s cache

async function get(key, fallback) {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && now - hit.t < TTL) return hit.v;
  const doc = await Setting.findOne({ key });
  const v = doc?.value ?? fallback;
  cache.set(key, { v, t: now });
  return v;
}

async function set(key, value) {
  await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
  cache.delete(key);
  return true;
}

async function getNumber(key, fallback) {
  const v = await get(key, fallback);
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

module.exports = { get, set, getNumber };

