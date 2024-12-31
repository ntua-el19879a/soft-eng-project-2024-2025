// Route (routes/tollStationRoutes.js)
const express = require('express');
const { getTollStationPasses } = require('../controllers/tollStationController');

const router = express.Router();

// Define the GET route for tollStationPasses
router.get('/:tollStationID/:date_from/:date_to', getTollStationPasses);

module.exports = router;