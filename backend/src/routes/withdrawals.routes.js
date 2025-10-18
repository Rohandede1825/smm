const router = require('express').Router();
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/withdrawals.controller');

router.post('/', auth, requireActive, requireVerified, [body('amount').isNumeric()], handleValidation, C.createWithdrawal);
router.get('/', auth, requireActive, requireVerified, C.listWithdrawals);

// Admin
router.get('/admin', auth, requireRole('admin'), C.adminList);
router.patch('/:id/status', auth, requireRole('admin'), [body('status').isString()], handleValidation, C.adminUpdateStatus);

module.exports = router;
