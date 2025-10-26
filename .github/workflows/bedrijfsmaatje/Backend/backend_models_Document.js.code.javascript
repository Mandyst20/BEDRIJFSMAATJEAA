const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'spreadsheet', 'presentation', 'other'],
        default: 'text'
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    tags: [{
        type: String,
        trim: true
    }],
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['viewer', 'editor'],
            default: 'viewer'
        }
    }],
    version: {
        type: Number,
        default: 1
    },
    versionHistory: [{
        version: Number,
        content: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: Date
    }],
    metadata: {
        fileSize: Number,
        fileType: String,
        lastModified: Date
    }
}, {
    timestamps: true
});

// Add indexes for frequent queries
documentSchema.index({ userId: 1 });
documentSchema.index({ title: 'text', content: 'text' });
documentSchema.index({ 'collaborators.userId': 1 });

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;