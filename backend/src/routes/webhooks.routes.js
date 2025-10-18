const router = require('express').Router();
const express = require('express');
const C = require('../controllers/webhooks.controller');

// Razorpay webhook requires raw body for signature verification.
router.post(
  '/razorpay',
  express.raw({ type: 'application/json' }),
  (req, res, next) => { req.bodyRaw = req.body.toString(); next(); },
  C.razorpayWebhook
);

module.exports = router;

