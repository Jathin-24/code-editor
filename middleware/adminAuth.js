const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized. Admin login required.'
        });
    }

    try {
        const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';
        const decoded = jwt.verify(token, secret);

        if (decoded.role !== 'admin') {
            throw new Error('Invalid role');
        }

        req.admin = decoded;
        next();
    } catch (error) {
        console.error('Auth Error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = { adminAuth };
