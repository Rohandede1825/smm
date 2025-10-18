const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/services', require('./services.routes'));
router.use('/orders', require('./orders.routes'));
router.use('/wallet', require('./wallet.routes'));
router.use('/referrals', require('./referrals.routes'));
router.use('/withdrawals', require('./withdrawals.routes'));
router.use('/tickets', require('./tickets.routes'));
router.use('/notifications', require('./notifications.routes'));
router.use('/ext', require('./api.routes'));
router.use('/panels', require('./panels.routes'));
router.use('/admin', require('./admin.routes'));
router.use('/webhooks', require('./webhooks.routes'));

module.exports = router;

