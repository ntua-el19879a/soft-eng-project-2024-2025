// Controller (controllers/tollStationController.js)
// Purpose: Manages the interaction between incoming requests (from routes) and service logic.
//  It’s responsible for parsing request parameters, invoking business logic in services,
// and sending appropriate responses or error messages.

const { getTollStationPasses } = require("../services/tollStationService");

exports.getTollStationPasses = async (req, res, next) => {
  try {
    const { tollStationID, date_from, date_to } = req.params;

    // Validate date format
    const dateRegex = /^\d{4}\d{2}\d{2}$/;
    if (!dateRegex.test(date_from) || !dateRegex.test(date_to)) {
      throw res
        .status(400)
        .json({ error: "Invalid date format. Use YYYYMMDD." });
    }
    if (date_from > date_to) {
      throw res
        .status(400)
        .json({
          error: "Invalid date range. The start date must be before the end date.",
        });
    }

    // Fetch data using the service
    const result = await getTollStationPasses(tollStationID, date_from, date_to);
    res.status(200).json(result);
  } catch (error) {
    if (error.status === 400) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};