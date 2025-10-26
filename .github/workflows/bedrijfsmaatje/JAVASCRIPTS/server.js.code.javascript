/**
 * Bedrijfsmaatje - Backend Server
 * Node.js/Express API voor het Bedrijfsmaatje platform
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Routes importeren
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscriptions');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');

// Environment variables laden
dotenv.config();

// Express app initialiseren
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// Rate limiting instellen
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuten
  max: 100, // max 100 requests per IP binnen windowMs
  message: 'Te veel requests van dit IP-adres, probeer het later opnieuw'
});
app.use('/api/', limiter);

// MongoDB verbinding
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB verbinding succesvol'))
.catch(err => console.error('MongoDB verbindingsfout:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Bedrijfsmaatje API is actief!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Er is een serverfout opgetreden',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});

module.exports = app; // Voor testing