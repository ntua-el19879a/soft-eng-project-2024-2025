const { login, refreshToken, logout } = require('../services/authService');

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await login(username, password);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Refresh token required' });

        const result = await refreshToken(token);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 403).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Refresh token required' });

        const result = await logout(token);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};
