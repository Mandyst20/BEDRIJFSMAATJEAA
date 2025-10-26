/**
 * Subscription Model
 * Schema voor abonnementen in het Bedrijfsmaatje platform
 */

const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['starter', 'groei', 'zakelijk', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'past_due', 'canceled', 'trialing'],
    default: 'trialing'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'EUR'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  trialEndsAt: {
    type: Date
  },
  canceledAt: {
    type: Date
  },
  // Mollie/Stripe specifieke velden
  paymentProviderId: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['ideal', 'creditcard', 'bancontact', 'paypal', 'sepa', 'other'],
    default: 'ideal'
  },
  // Features inbegrepen in dit abonnement
  features: [{
    name: String,
    limit: Number, // bijv. aantal gebruikers, aantal documenten, etc.
    used: {
      type: Number,
      default: 0
    }
  }],
  // Factuurgeschiedenis
  invoices: [{
    invoiceNumber: String,
    amount: Number,
    status: {
      type: String,
      enum: ['paid', 'pending', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
    pdfUrl: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Metadata
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Virtuele eigenschap voor dagen tot einde proefperiode
SubscriptionSchema.virtual('daysRemaining').get(function() {
  if (!this.trialEndsAt) return 0;
  
  const now = new Date();
  const diffTime = this.trialEndsAt - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
});

// Virtuele eigenschap voor actief abonnement
SubscriptionSchema.virtual('isActive').get(function() {
  return ['active', 'trialing'].includes(this.status);
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);