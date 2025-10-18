const router = require('express').Router();
const { body } = require('express-validator');
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/orders.controller');

router.post('/', auth, requireActive, requireVerified,
  [body('serviceId').isString(), body('linkOrUsername').isString(), body('quantity').isInt({ min: 1 })],
  handleValidation,
  C.placeOrder
);
router.get('/', auth, requireActive, requireVerified, C.listOrders);
router.get('/:id', auth, requireActive, requireVerified, C.getOrder);
router.post('/:id/reorder', auth, requireActive, requireVerified, C.reorder);

// Admin
router.patch('/:id/status', auth, requireRole('admin'), [body('status').isString()], handleValidation, C.adminUpdateStatus);

module.exports = router;
