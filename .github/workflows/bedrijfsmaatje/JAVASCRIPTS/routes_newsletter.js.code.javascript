/**
 * Newsletter Routes
 * Routes voor nieuwsbrief inschrijvingen
 */

const express = require('express');
const router = express.Router();
const { 
  subscribe, 
  unsubscribe, 
  getSubscribers,
  exportSubscribers
} = require('../controllers/newsletter');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe/:email', unsubscribe);

// Admin routes
router.get('/', protect, authorize('admin'), getSubscribers);
router.get('/export', protect, authorize('admin'), exportSubscribers);

module.exports = router;