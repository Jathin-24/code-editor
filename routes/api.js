const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Submission = require('../models/Submission');
const { adminAuth } = require('../middleware/adminAuth');

// Login/Register endpoint
router.post('/login', async (req, res) => {
    try {
        const { rollNo, name } = req.body;

        if (!rollNo || !name) {
            return res.status(400).json({
                success: false,
                message: 'Roll number and name are required'
            });
        }

        const rollNoRegex = /^[0-9]{2}[A-Z]{2}[0-9][A-Z][0-9]{2}[A-Z0-9]{2}$/;
        if (!rollNoRegex.test(rollNo.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid roll number format. Example: 23JR1A05A4'
            });
        }

        // Find or create user
        let user = await User.findOne({ rollNo: rollNo.toUpperCase() });

        if (!user) {
            // Create new user
            user = new User({
                rollNo: rollNo.toUpperCase(),
                name: name.trim()
            });
            await user.save();

            // Create initial project for new user
            const project = new Project({
                userId: user._id,
                rollNo: user.rollNo
            });
            await project.save();

            return res.json({
                success: true,
                message: 'Account created successfully!',
                user: {
                    id: user._id,
                    rollNo: user.rollNo,
                    name: user.name
                },
                isNewUser: true
            });
        } else {
            // Update last login
            await user.updateLastLogin();

            return res.json({
                success: true,
                message: 'Login successful!',
                user: {
                    id: user._id,
                    rollNo: user.rollNo,
                    name: user.name
                },
                isNewUser: false
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

// Get user's project/code
router.get('/project/:rollNo', async (req, res) => {
    try {
        const { rollNo } = req.params;

        const project = await Project.findOne({ rollNo: rollNo.toUpperCase() });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            project: {
                html: project.html,
                css: project.css,
                javascript: project.javascript,
                updatedAt: project.updatedAt
            }
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

// Save user's code
router.post('/save', async (req, res) => {
    try {
        const { rollNo, html, css, javascript } = req.body;

        if (!rollNo) {
            return res.status(400).json({
                success: false,
                message: 'Roll number is required'
            });
        }

        const project = await Project.findOneAndUpdate(
            { rollNo: rollNo.toUpperCase() },
            {
                html: html || '',
                css: css || '',
                javascript: javascript || ''
            },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Code saved successfully!',
            updatedAt: project.updatedAt
        });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save code'
        });
    }
});

// Get overall submission statistics (for admin dashboard)
router.get('/admin/stats/overall', adminAuth, async (req, res) => {
    try {
        const totalSubmissions = await Submission.countDocuments();
        const submitted = await Submission.countDocuments({ status: 'SUBMITTED' });
        const disqualified = await Submission.countDocuments({ status: 'DISQUALIFIED' });
        const inProgress = await Submission.countDocuments({ status: 'IN_PROGRESS' });

        res.json({
            success: true,
            stats: {
                total: totalSubmissions,
                submitted,
                disqualified,
                inProgress
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

// Get all users (for admin purposes)
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-__v').sort({ lastLogin: -1 });

        // Get submission counts for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const submissions = await Submission.find({ userId: user._id });
            const completedCount = submissions.filter(s => s.status === 'SUBMITTED').length;
            const disqualifiedCount = submissions.filter(s => s.status === 'DISQUALIFIED').length;

            return {
                ...user.toObject(),
                stats: {
                    total: submissions.length,
                    completed: completedCount,
                    disqualified: disqualifiedCount
                }
            };
        }));

        res.json({
            success: true,
            count: usersWithStats.length,
            users: usersWithStats
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

module.exports = router;
