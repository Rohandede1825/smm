const router = require('express').Router();
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/users.controller');

router.get('/me', auth, requireActive, requireVerified, C.me);
router.patch('/me', auth, requireActive, [body('name').optional().isString(), body('email').optional().isEmail()], handleValidation, C.updateMe);
router.post('/api-key', auth, C.generateApiKey);

module.exports = router;
