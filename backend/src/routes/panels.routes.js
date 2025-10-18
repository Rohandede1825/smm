const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/panels.controller');

router.post('/', auth, requireRole('reseller', 'admin'), [body('domain').isString()], handleValidation, C.createPanel);
router.get('/', auth, requireRole('reseller', 'admin'), C.listPanels);
router.get('/:id', auth, requireRole('reseller', 'admin'), C.getPanel);
router.patch('/:id', auth, requireRole('admin'), C.adminUpdate);

module.exports = router;

