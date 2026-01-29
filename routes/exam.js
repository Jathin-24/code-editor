const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Exam = require('../models/Exam');
const Submission = require('../models/Submission');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { adminAuth } = require('../middleware/adminAuth');

// Admin login endpoint
router.post('/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;

        const validUsername = process.env.ADMIN_USERNAME || 'admin';
        const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

        if (username === validUsername && password === validPassword) {
            // Generate real JWT token
            const token = jwt.sign(
                { username, role: 'admin' },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                message: 'Admin login successful'
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

// Get active exams
router.get('/exams/active', async (req, res) => {
    try {
        const exams = await Exam.find({
            isActive: true
        })
            .sort({ createdAt: -1 })
            .select('-__v -question'); // Hide question until exam starts

        res.json({
            success: true,
            exams
        });
    } catch (error) {
        console.error('Get exams error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exams'
        });
    }
});

// Get exam by ID
router.get('/exams/:id', async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        res.json({
            success: true,
            exam
        });
    } catch (error) {
        console.error('Get exam error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exam'
        });
    }
});

// Start exam (create submission)
router.post('/exams/:id/start', async (req, res) => {
    try {
        const { rollNo } = req.body;
        const examId = req.params.id;

        // Check if exam exists and is active
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Exam not found'
            });
        }

        const now = new Date();
        if (now < exam.startTime || now > exam.endTime) {
            return res.status(400).json({
                success: false,
                message: 'Exam is not currently active'
            });
        }

        // Check if user already has a submission
        const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let submission = await Submission.findOne({
            userId: user._id,
            examId: examId
        });

        if (submission && submission.status === 'SUBMITTED') {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this exam'
            });
        }

        if (!submission) {
            // Create new submission
            submission = new Submission({
                userId: user._id,
                rollNo: user.rollNo,
                examId: examId,
                startedAt: new Date(),
                status: 'IN_PROGRESS'
            });
            await submission.save();
        }

        // Log activity
        await new ActivityLog({
            userId: user._id,
            rollNo: user.rollNo,
            examId: examId,
            activityType: 'EXAM_STARTED',
            description: `Started exam: ${exam.title}`,
            severity: 'LOW'
        }).save();

        res.json({
            success: true,
            submissionId: submission._id,
            exam,
            message: 'Exam started successfully'
        });
    } catch (error) {
        console.error('Start exam error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start exam'
        });
    }
});

// Log activity (anti-cheating)
router.post('/activity/log', async (req, res) => {
    try {
        const { rollNo, examId, activityType, description, severity, metadata } = req.body;

        const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create activity log
        const log = new ActivityLog({
            userId: user._id,
            rollNo: user.rollNo,
            examId,
            activityType,
            description,
            severity: severity || 'LOW',
            metadata
        });
        await log.save();

        // If this is a cheating-related activity, update submission
        if (examId && ['TAB_SWITCH', 'WINDOW_BLUR', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'DEVTOOLS_OPENED', 'FULLSCREEN_EXIT'].includes(activityType)) {
            const submission = await Submission.findOne({
                userId: user._id,
                examId: examId,
                status: 'IN_PROGRESS'
            });

            if (submission) {
                // Add cheating flag
                submission.cheatingFlags.push({
                    type: activityType,
                    timestamp: new Date(),
                    description
                });

                // Increment tab switch counter
                if (activityType === 'TAB_SWITCH' || activityType === 'WINDOW_BLUR') {
                    submission.tabSwitchCount += 1;

                    // Check if exceeded max tab switches
                    const exam = await Exam.findById(examId);
                    if (exam && submission.tabSwitchCount >= exam.maxTabSwitches) {
                        submission.status = 'DISQUALIFIED';
                        submission.isDisqualified = true;
                        submission.disqualificationReason = `Exceeded maximum tab switches (${exam.maxTabSwitches})`;
                        submission.submittedAt = new Date();

                        // Log disqualification
                        await new ActivityLog({
                            userId: user._id,
                            rollNo: user.rollNo,
                            examId,
                            activityType: 'SUSPICIOUS_ACTIVITY',
                            description: `Disqualified: ${submission.disqualificationReason}`,
                            severity: 'CRITICAL'
                        }).save();
                    }
                }

                await submission.save();

                return res.json({
                    success: true,
                    warning: submission.isDisqualified ? 'You have been disqualified' : (submission.tabSwitchCount >= (exam?.maxTabSwitches || 3) - 1 ? 'Warning: One more violation will disqualify you' : null),
                    disqualified: submission.isDisqualified
                });
            }
        }

        res.json({
            success: true
        });
    } catch (error) {
        console.error('Log activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to log activity'
        });
    }
});

// Save exam code (auto-save during exam)
router.post('/exams/save', async (req, res) => {
    try {
        const { rollNo, examId, html, css, javascript } = req.body;

        const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const submission = await Submission.findOne({
            userId: user._id,
            examId: examId,
            status: 'IN_PROGRESS'
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'No active submission found'
            });
        }

        // Update code
        submission.html = html || '';
        submission.css = css || '';
        submission.javascript = javascript || '';

        // Update time spent
        const now = new Date();
        submission.timeSpent = Math.floor((now - submission.startedAt) / 1000);

        await submission.save();

        // Log activity
        await new ActivityLog({
            userId: user._id,
            rollNo: user.rollNo,
            examId,
            activityType: 'CODE_SAVED',
            description: 'Auto-saved code',
            severity: 'LOW'
        }).save();

        res.json({
            success: true,
            message: 'Code saved'
        });
    } catch (error) {
        console.error('Save exam code error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save code'
        });
    }
});

// Submit exam
router.post('/exams/:id/submit', async (req, res) => {
    try {
        const { rollNo } = req.body;
        const examId = req.params.id;

        const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const submission = await Submission.findOne({
            userId: user._id,
            examId: examId
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'No submission found'
            });
        }

        if (submission.status === 'SUBMITTED') {
            return res.status(400).json({
                success: false,
                message: 'Exam already submitted'
            });
        }

        if (submission.status === 'DISQUALIFIED') {
            return res.status(400).json({
                success: false,
                message: 'You have been disqualified'
            });
        }

        // Update submission
        submission.status = 'SUBMITTED';
        submission.submittedAt = new Date();
        submission.timeSpent = Math.floor((submission.submittedAt - submission.startedAt) / 1000);

        await submission.save();

        // Log activity
        await new ActivityLog({
            userId: user._id,
            rollNo: user.rollNo,
            examId,
            activityType: 'EXAM_SUBMITTED',
            description: 'Submitted exam',
            severity: 'LOW'
        }).save();

        res.json({
            success: true,
            message: 'Exam submitted successfully',
            submission
        });
    } catch (error) {
        console.error('Submit exam error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit exam'
        });
    }
});

// Get submission status
router.get('/exams/:examId/submission/:rollNo', async (req, res) => {
    try {
        const { examId, rollNo } = req.params;

        const user = await User.findOne({ rollNo: rollNo.toUpperCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const submission = await Submission.findOne({
            userId: user._id,
            examId: examId
        });

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submission'
        });
    }
});

// Admin: Get all exams
router.get('/admin/exams', adminAuth, async (req, res) => {
    try {
        const exams = await Exam.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            exams
        });
    } catch (error) {
        console.error('Admin get exams error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exams'
        });
    }
});

// Admin: Get all submissions for an exam
router.get('/admin/exams/:examId/submissions', adminAuth, async (req, res) => {
    try {
        const submissions = await Submission.find({ examId: req.params.examId })
            .populate('userId', 'rollNo name')
            .sort({ submittedAt: -1 });

        res.json({
            success: true,
            submissions
        });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submissions'
        });
    }
});

// Admin: Get single submission by ID
router.get('/admin/submissions/:id', adminAuth, async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('userId', 'rollNo name')
            .populate('examId', 'title description');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.json({
            success: true,
            submission
        });
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch submission'
        });
    }
});

// Admin: Get activity logs for a student
router.get('/admin/logs/:rollNo', adminAuth, async (req, res) => {
    try {
        const logs = await ActivityLog.find({ rollNo: req.params.rollNo.toUpperCase() })
            .sort({ timestamp: -1 })
            .limit(100);

        res.json({
            success: true,
            logs
        });
    } catch (error) {
        console.error('Get logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch logs'
        });
    }
});

// Admin: Create exam
router.post('/admin/exams', adminAuth, async (req, res) => {
    try {
        const exam = new Exam(req.body);
        await exam.save();

        res.json({
            success: true,
            exam,
            message: 'Exam created successfully'
        });
    } catch (error) {
        console.error('Create exam error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create exam'
        });
    }
});

module.exports = router;
