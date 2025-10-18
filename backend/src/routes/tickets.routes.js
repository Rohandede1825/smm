const router = require('express').Router();
const { auth, requireVerified, requireActive } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/tickets.controller');

router.post('/', auth, requireActive, requireVerified, [body('subject').isString(), body('message').isString()], handleValidation, C.createTicket);
router.get('/', auth, requireActive, requireVerified, C.listTickets);
router.post('/:id/messages', auth, requireActive, requireVerified, [body('message').isString()], handleValidation, C.replyTicket);

// Admin
router.post('/:id/admin-reply', auth, requireRole('admin', 'support', 'staff'), [body('message').isString()], handleValidation, C.adminReply);
router.post('/:id/close', auth, requireRole('admin', 'support', 'staff'), C.adminClose);

module.exports = router;
