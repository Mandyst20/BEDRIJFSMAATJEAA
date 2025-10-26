/**
 * User Model
 * Schema voor gebruikers in het Bedrijfsmaatje platform
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naam is verplicht'],
    trim: true
  },
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
  password: {
    type: String,
    required: [true, 'Wachtwoord is verplicht'],
    minlength: 8,
    select: false // Niet meesturen in queries
  },
  company: {
    type: String,
    required: [true, 'Bedrijfsnaam is verplicht'],
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  industry: {
    type: String,
    enum: ['horeca', 'retail', 'zzp', 'dienstverlening', 'overig'],
    default: 'overig'
  },
  companySize: {
    type: String,
    enum: ['1', '2-5', '6-10', '11-25', '26-50', '50+'],
    default: '1'
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'past_due', 'canceled', 'none'],
    default: 'none'
  },
  subscriptionId: {
    type: String,
    default: null
  },
  trialEnds: {
    type: Date,
    default: function() {
      // 14 dagen proefperiode vanaf registratie
      const date = new Date();
      date.setDate(date.getDate() + 14);
      return date;
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // Gebruikersvoorkeuren
  preferences: {
    language: {
      type: String,
      enum: ['nl', 'en'],
      default: 'nl'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      app: {
        type: Boolean,
        default: true
      }
    },
    dashboardModules: {
      type: [String],
      default: ['analytics', 'tasks', 'calendar', 'documents']
    }
  },
  // Gebruiksstatistieken
  usage: {
    loginCount: {
      type: Number,
      default: 0
    },
    lastFeatureUsed: String,
    featuresUsed: [{
      feature: String,
      count: Number,
      lastUsed: Date
    }]
  }
}, {
  timestamps: true
});

// Wachtwoord hashen voor opslaan
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT token genereren
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Wachtwoord vergelijken
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset token genereren
UserSchema.methods.getResetPasswordToken = function() {
  // Token genereren
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Token hashen en in database opslaan
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Token 10 minuten geldig
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);