const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const { body } = require('express-validator');
const { handleValidation } = require('../middleware/validate');
const C = require('../controllers/admin.controller');

// Role gates per section
router.get('/overview', auth, requireRole('admin', 'staff'), C.overview);
router.get('/analytics', auth, requireRole('admin', 'staff'), C.analytics);

// Users
router.get('/users', auth, requireRole('admin', 'staff', 'support'), C.listUsers);
router.get('/users/:id', auth, requireRole('admin', 'staff'), C.userDetails);
router.patch('/users/:id/role', auth, requireRole('admin'), [body('role').isString()], handleValidation, C.updateUserRole);
router.patch('/users/:id/status', auth, requireRole('admin', 'staff'), [body('status').isString()], handleValidation, C.updateUserStatus);
router.post('/users/:id/wallet-adjust', auth, requireRole('admin', 'staff'), [body('amount').isNumeric()], handleValidation, C.adjustWallet);

// Orders
router.get('/orders', auth, requireRole('admin', 'staff'), C.listOrders);
router.post('/orders/manual', auth, requireRole('admin', 'staff'), [body('userId').isString(), body('serviceId').isString(), body('linkOrUsername').isString(), body('quantity').isInt({ min: 1 })], handleValidation, C.manualOrder);

// Transactions
router.get('/transactions', auth, requireRole('admin', 'staff'), C.listTransactions);

// Withdrawals
router.get('/withdrawals', auth, requireRole('admin', 'staff'), C.listWithdrawals);

// Services and Providers
router.delete('/services/:id', auth, requireRole('admin'), C.deleteService);
router.patch('/services/:id/provider', auth, requireRole('admin'), [body('providerId').isString(), body('providerServiceId').isString()], handleValidation, C.linkServiceProvider);

router.get('/providers', auth, requireRole('admin'), C.listProviders);
router.post('/providers', auth, requireRole('admin'), [body('name').isString(), body('baseUrl').isString()], handleValidation, C.createProvider);
router.patch('/providers/:id', auth, requireRole('admin'), C.updateProvider);
router.delete('/providers/:id', auth, requireRole('admin'), C.deleteProvider);

// Manual payments and webhook logs
router.get('/manual-payments', auth, requireRole('admin', 'staff'), C.listManualPayments);
router.post('/manual-payments', auth, requireRole('admin', 'staff'), [body('userId').isString(), body('amount').isNumeric()], handleValidation, C.createManualPayment);
router.patch('/manual-payments/:id', auth, requireRole('admin', 'staff'), [body('status').isString()], handleValidation, C.reviewManualPayment);
router.get('/webhook-logs', auth, requireRole('admin'), C.listWebhookLogs);

// Tickets (support)
router.get('/tickets', auth, requireRole('admin', 'support', 'staff'), C.adminTickets);

// Settings
router.get('/settings', auth, requireRole('admin'), C.getSettings);
router.post('/settings', auth, requireRole('admin'), C.setSettings);

// Reports & logs
router.get('/reports/export', auth, requireRole('admin'), C.exportReport);
router.get('/logs', auth, requireRole('admin'), C.listAdminLogs);

module.exports = router;
