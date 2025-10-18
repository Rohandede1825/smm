const AdminLog = require('../models/AdminLog');

async function logAdminAction({ actor, role, action, targetType, targetId, meta }) {
  try {
    await AdminLog.create({ actor, role, action, targetType, targetId, meta });
  } catch (e) {
    console.error('AdminLog error', e.message);
  }
}

module.exports = { logAdminAction };

