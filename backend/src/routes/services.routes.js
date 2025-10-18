const router = require('express').Router();
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const C = require('../controllers/services.controller');

router.get('/categories', C.listCategories);
router.get('/', C.listServices);
router.get('/:id', C.getService);

// Admin
router.post('/categories', auth, requireRole('admin'), [body('name').isString(), body('slug').isString()], handleValidation, C.createCategory);
router.post('/', auth, requireRole('admin'),
  [body('name').isString(), body('category').isString(), body('pricePer1000').isNumeric(), body('minQty').isNumeric(), body('maxQty').isNumeric()],
  handleValidation,
  C.createService
);
router.patch('/:id', auth, requireRole('admin'), C.updateService);

module.exports = router;

