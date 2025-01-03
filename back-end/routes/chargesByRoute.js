const express = require('express');
const { getChargesBy } = require('../controllers/chargesByController');

const router = express.Router();

// Define the GET route for chargesBy
router.get('/:tollOpID/:date_from/:date_to', getChargesBy);

module.exports = router;