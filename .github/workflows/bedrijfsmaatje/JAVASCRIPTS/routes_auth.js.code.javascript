/**
 * Authentication Routes
 * Routes voor gebruikersregistratie, login en wachtwoordbeheer
 */

const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updatePassword,
  verifyEmail
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.get('/verify-email/:token', verifyEmail);

module.exports = router;