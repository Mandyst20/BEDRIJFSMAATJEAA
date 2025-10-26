/**
 * Contact Model
 * Schema voor contactformulier berichten
 */

const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam is verplicht'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is verplicht'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Vul een geldig e-mailadres in'
    ],
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Onderwerp is verplicht'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Bericht is verplicht'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'responded', 'closed'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  source: {
    type: String,
    enum: ['contact_form', 'chat', 'email', 'phone', 'other'],
    default: 'contact_form'
  },
  // Voor GDPR compliance
  ipAddress: String,
  userAgent: String,
  consentGiven: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);