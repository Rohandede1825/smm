const router = require('express').Router();
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/referrals.controller');

router.get('/me', auth, requireActive, requireVerified, C.myReferral);
router.post('/withdraw-to-wallet', auth, requireActive, requireVerified, [body('amount').optional().isNumeric()], handleValidation, C.withdrawToWallet);

module.exports = router;
