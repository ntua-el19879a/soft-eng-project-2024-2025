const express = require('express');
const { getPassesCost } = require('../controllers/passesCostController');

const router = express.Router();

// Define the GET route for passesCost
router.get('/:tollOpID/:tagOpID/:date_from/:date_to', getPassesCost);

module.exports = router;