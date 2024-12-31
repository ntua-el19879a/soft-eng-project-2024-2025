// Controller (controllers/tollStationController.js)
const { getTollStationPasses } = require('../services/tollStationService');

exports.getTollStationPasses = async (req, res, next) => {
    try {
        const { tollStationID, date_from, date_to } = req.params;

        // Fetch data using the service
        const result = await getTollStationPasses(tollStationID, date_from, date_to);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

