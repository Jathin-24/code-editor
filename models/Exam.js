const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true,
        default: 60
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    allowCopyPaste: {
        type: Boolean,
        default: false
    },
    requireFullScreen: {
        type: Boolean,
        default: true
    },
    maxTabSwitches: {
        type: Number,
        default: 3 // Student fails after 3 tab switches
    },
    createdBy: {
        type: String,
        required: true,
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exam', examSchema);
