const { getPassAnalysisData } = require('../services/passAnalysisService');

exports.getPassAnalysis = async (req, res, next) => {
    try {
        const { stationOpID, tagOpID, date_from, date_to } = req.params;

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
        // That is necceary to check if the station operator ID and the tag operator ID are different
        if (stationOpID === tagOpID) {
            throw res
                .status(400)
                .json({ error: "Invalid operation ID. The station operation ID and the tag operation ID must be different." });
        }

        // Fetch the analysis data
        const result = await getPassAnalysisData(stationOpID, tagOpID, date_from, date_to);
        res.status(200).json(result);
    } catch (error) {
        if (error.status === 400) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};