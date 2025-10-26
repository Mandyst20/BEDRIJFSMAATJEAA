const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'expired', 'pending'],
        default: 'pending'
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    currentPeriodStart: {
        type: Date,
        required: true
    },
    currentPeriodEnd: {
        type: Date,
        required: true
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    features: {
        aiCredits: Number,
        maxDocuments: Number,
        maxTeamMembers: Number,
        customBranding: Boolean,
        apiAccess: Boolean,
        prioritySupport: Boolean
    },
    paymentHistory: [{
        paymentId: String,
        amount: Number,
        status: String,
        date: Date
    }]
}, {
    timestamps: true
});

// Add indexes for frequent queries
subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ stripeSubscriptionId: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;