const express = require('express');
const { getPassAnalysis } = require('../controllers/passAnalysisController');

const router = express.Router();

// Define the GET route for passAnalysis
router.get('/:stationOpID/:tagOpID/:date_from/:date_to', getPassAnalysis);

module.exports = router;