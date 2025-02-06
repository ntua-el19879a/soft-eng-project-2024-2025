const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwtConfig');

exports.authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

exports.authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access forbidden: Admins only' });
        }
        next();
    };
};
