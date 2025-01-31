const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authenticateJWT, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(authenticateJWT, authorizeRoles(['admin']));

router.get('/healthcheck', adminController.healthCheck);
router.post('/resetstations', adminController.upload, adminController.resetStations)
router.post('/resetpasses', adminController.resetPasses);
router.post('/addpasses', upload.single('file'), adminController.addPasses);


module.exports = router;