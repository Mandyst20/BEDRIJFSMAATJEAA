/**
 * Newsletter Model
 * Schema voor nieuwsbrief inschrijvingen
 */

const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is verplicht'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vul een geldig e-mailadres in'
    ],
    lowercase: true
  },
  name: {
    type: String,
    trim: true
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    enum: ['website', 'blog', 'webinar', 'referral', 'other'],
    default: 'website'
  },
  interests: {
    type: [String],
    default: []
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  // Voor GDPR compliance
  ipAddress: String,
  userAgent: String,
  consentGiven: {
    type: Boolean,
    default: true
  },
  // Tracking
  opens: [{
    campaignId: String,
    timestamp: Date
  }],
  clicks: [{
    campaignId: String,
    url: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Newsletter', NewsletterSchema);