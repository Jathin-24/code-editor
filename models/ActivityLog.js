const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
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
        ref: 'Exam'
    },
    activityType: {
        type: String,
        required: true,
        enum: [
            'LOGIN',
            'LOGOUT',
            'TAB_SWITCH',
            'WINDOW_BLUR',
            'COPY_ATTEMPT',
            'PASTE_ATTEMPT',
            'DEVTOOLS_OPENED',
            'FULLSCREEN_EXIT',
            'CODE_SAVED',
            'EXAM_STARTED',
            'EXAM_SUBMITTED',
            'EXAM_TIMEOUT',
            'RIGHT_CLICK',
            'SUSPICIOUS_ACTIVITY'
        ]
    },
    description: {
        type: String
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
activityLogSchema.index({ rollNo: 1, timestamp: -1 });
activityLogSchema.index({ examId: 1, activityType: 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
