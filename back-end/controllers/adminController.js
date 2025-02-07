const adminService = require('../services/adminService');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

module.exports = {
    healthCheck: async (req, res) => {
        try {
            const result = await adminService.healthCheck();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                error: error.message,
                dbconnection: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/toll-interop-db'
            });
        }
    },

    resetStations: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "Missing CSV file",
                    status: 'failed'
                });
            }
            await adminService.resetStations(req.file.path);
            res.status(200).json({ status: 'OK' });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                status: 'failed'
            });
        }
    },

    resetPasses: async (req, res) => {
        try {
            await adminService.resetPasses();
            res.status(200).json({ status: 'OK' });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                status: 'failed'
            });
        }
    },

    addPasses: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    error: "Missing CSV file",
                    status: 'failed'
                });
            }
            await adminService.addPasses(req.file.path);
            res.status(200).json({ status: 'OK' });
        } catch (error) {
            res.status(500).json({
                error: error.message,
                status: 'failed'
            });
        }
    },

    modifyUser: async (req, res) => {
        try {
            const { username, password, role } = req.params;
            if (!username || !password) {
                return res.status(400).json({ error: "Username and password are required" });
            }

            // Default role to "operator" if not provided
            const result = await adminService.modifyUser(username, password, role || 'operator');
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUsers: async (req, res) => {
        try {
            const result = await adminService.getUsers();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Middleware for handling file uploads
    upload: upload.single('file')
};
