const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');
const webhooksController = require('./controllers/webhooks.controller');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*', credentials: true }));
// Razorpay webhook must receive raw body for signature verification
app.post('/api/v1/webhooks/razorpay', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.bodyRaw = req.body.toString();
  return webhooksController.razorpayWebhook(req, res, next);
});

// JSON parser for all other routes
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/', apiLimiter);

app.get('/', (req, res) => {
  res.json({ ok: true, name: 'SMM Panel API', version: '1.0.0' });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
