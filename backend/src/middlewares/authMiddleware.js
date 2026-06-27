const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'inventrix_secret_key_123';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Session expired. Please log in again.' });
    }
};

module.exports = authMiddleware;
