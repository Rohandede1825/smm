const router = require('express').Router();
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/wallet.controller');

router.get('/transactions', auth, requireActive, requireVerified, C.listTransactions);
router.post('/deposit/order', auth, requireActive, requireVerified, [body('amount').isNumeric()], handleValidation, C.createDepositOrder);

module.exports = router;
