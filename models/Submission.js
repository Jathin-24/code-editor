const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNo: {
        type: String,
        required: true
    },
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    html: {
        type: String,
        default: ''
    },
    css: {
        type: String,
        default: ''
    },
    javascript: {
        type: String,
        default: ''
    },
    startedAt: {
        type: Date,
        required: true
    },
    submittedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['IN_PROGRESS', 'SUBMITTED', 'TIMEOUT', 'DISQUALIFIED'],
        default: 'IN_PROGRESS'
    },
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    tabSwitchCount: {
        type: Number,
        default: 0
    },
    cheatingFlags: [{
        type: {
            type: String
        },
        timestamp: Date,
        description: String
    }],
    grade: {
        type: Number,
        min: 0,
        max: 100
    },
    feedback: {
        type: String
    },
    isDisqualified: {
        type: Boolean,
        default: false
    },
    disqualificationReason: {
        type: String
    }
});

module.exports = mongoose.model('Submission', submissionSchema);
