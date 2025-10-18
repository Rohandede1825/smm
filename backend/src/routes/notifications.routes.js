const router = require('express').Router();
const { auth } = require('../middleware/auth');
const C = require('../controllers/notifications.controller');

router.get('/', auth, C.list);
router.post('/:id/read', auth, C.markRead);

module.exports = router;

