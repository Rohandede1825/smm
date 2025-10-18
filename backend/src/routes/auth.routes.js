const router = require('express').Router();
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/auth.controller');

router.post(
  '/register',
  [body('name').isString().isLength({ min: 2 }), body('email').isEmail(), body('password').isLength({ min: 6 })],
  handleValidation,
  C.register
);

router.post('/login', [body('email').isEmail(), body('password').exists()], handleValidation, C.login);
router.post('/verify-email', [body('email').isEmail(), body('code').isLength({ min: 4 })], handleValidation, C.verifyEmail);
router.post('/resend-otp', [body('email').isEmail()], handleValidation, C.resendOtp);
router.post('/refresh', [body('refreshToken').isString()], handleValidation, C.refresh);
router.post('/logout', C.logout);
router.post('/forgot', [body('email').isEmail()], handleValidation, C.forgotPassword);
router.post('/reset', [body('email').isEmail(), body('code').isString(), body('newPassword').isLength({ min: 6 })], handleValidation, C.resetPassword);

module.exports = router;

