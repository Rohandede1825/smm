const router = require('express').Router();
const { apiKeyAuth } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/api.controller');

router.get('/services', apiKeyAuth(), C.listServices);
router.post('/order', apiKeyAuth(), [body('serviceId').isString(), body('linkOrUsername').isString(), body('quantity').isInt({ min: 1 })], handleValidation, C.placeOrder);
router.get('/order/:id', apiKeyAuth(), C.getOrder);

module.exports = router;

