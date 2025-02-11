const { MongoClient } = require('mongodb');
const { mongoUri } = require('../config/dbConfig');
const dbName = "toll-interop-db";
const passesCollection = "passes";
const operatorsCollection = "operators";

exports.getTollStatsData = async (operatorId, periodType, year, periodValue) => {
    let client;

    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        const db = client.db(dbName);

        // Find the operator to get TollIDs
        const operator = await db.collection(operatorsCollection).findOne({ OpID: operatorId });
        if (!operator) {
            const error = new Error("Invalid Operator ID");
            error.status = 400;
            throw error;
        }
        const tollIDs = operator.TollIDs;

        let startDate, endDate;

        switch (periodType) {
            case 'yearly':
                startDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0)); // January 1st, 00:00:00 UTC
                endDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999)); // December 31st, 23:59:59.999 UTC
                break;
            case 'monthly': {
                const month = parseInt(periodValue, 10) - 1; // JavaScript months are 0-indexed
                startDate = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)); // First day of the month, 00:00:00 UTC
                endDate = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)); // Last day of the month, 23:59:59.999 UTC
                break;
            }
            case 'quarterly': {
                const quarter = parseInt(periodValue, 10);
                const startMonth = (quarter - 1) * 3; // JavaScript months are 0-indexed
                const endMonth = startMonth + 3;
                startDate = new Date(Date.UTC(year, startMonth, 1, 0, 0, 0, 0)); // First day of the quarter, 00:00:00 UTC
                endDate = new Date(Date.UTC(year, endMonth, 0, 23, 59, 59, 999)); // Last day of the quarter, 23:59:59.999 UTC
                break;
            }
            default:
                throw new Error("Invalid period type");
        }

        // Logging for debugging
        console.log("startDate (UTC):", startDate.toISOString());
        console.log("endDate (UTC):", endDate.toISOString());

        const aggregationPipeline = [
            {
                $match: {
                    tollID: { $in: tollIDs },
                    timestamp: {
                        $gte: startDate,
                        $lt: endDate // Use $lt to exclude the exact endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$tollID",
                    nPasses: { $sum: 1 },
                    totalCharges: { $sum: "$charge" }
                }
            },
            {
                $project: {
                    _id: 0,
                    tollID: "$_id",
                    nPasses: 1,
                    totalCharges: 1,
                }
            }
        ];

        const tollStats = await db.collection(passesCollection)
            .aggregate(aggregationPipeline)
            .toArray();

        // Format totalCharges for each toll to two decimal places
        const formattedTollStats = tollStats.map(toll => ({
            ...toll,
            totalCharges: parseFloat(toll.totalCharges.toFixed(2)) // Round to 2 decimals and convert to number
        }));

        // Sort the tollStats array by tollID
        formattedTollStats.sort((a, b) => {
            if (a.tollID < b.tollID) return -1;
            if (a.tollID > b.tollID) return 1;
            return 0;
        });

        const totalPasses = formattedTollStats.reduce((sum, toll) => sum + toll.nPasses, 0);
        const totalCharges = formattedTollStats.reduce((sum, toll) => sum + toll.totalCharges, 0).toFixed(2);

        const result = {
            operator: operator.Operator,
            opid: operatorId,
            periodType: periodType,
            period: periodValue || year, // Display year for yearly, month/quarter for others
            nPasses: totalPasses,
            totalCharges: parseFloat(totalCharges),
            tolls: formattedTollStats
        };

        return result;

    } catch (error) {
        if (error.status === 400) {
            throw error;
        }
        console.error("Error in getTollStatsData:", error); // Log full error for debugging
        throw new Error("Internal Server Error");
    } finally {
        if (client) {
            await client.close();
        }
    }
};