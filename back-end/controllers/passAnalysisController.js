const { getPassAnalysisData } = require('../services/passAnalysisService');

exports.getPassAnalysis = async (req, res, next) => {
    try {
        const { stationOpID, tagOpID, date_from, date_to } = req.params;
        const format = req.query.format || 'json'; // Query parameter to define response format

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
        // TODO: Ask if the station operator ID and the tag operator ID have to be different

        // if (stationOpID === tagOpID) {
        //     throw res
        //         .status(400)
        //         .json({ error: "Invalid operation ID. The station operation ID and the tag operation ID must be different." });
        // }

        // Validate format type
        if (format !== 'json' && format !== 'csv') {
            return res.status(400).json({ error: "Invalid format specified. Use 'json' or 'csv'." });
        }

        // Fetch the analysis data
        const result = await getPassAnalysisData(stationOpID, tagOpID, date_from, date_to, format);

        if (!result) {
            return res.status(204).send(); // No content
        }

        // Respond with the appropriate format
        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            return res.status(200).send(result);
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(200).json(result);
    } catch (error) {
        if (error.status === 400) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};