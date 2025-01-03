const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const dbName = 'toll-interop-db';
const passesCollection = 'passes';
const operatorsCollection = 'operators_v2';
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');


exports.getChargesByData = async (tollOpID, dateFrom, dateTo) => {
    let client;

    try {

        // Convert dateFrom and dateTo to YYYY-MM-DD HH:MM format
        const formattedDateFrom = timestampFormatter(dateFrom, "0000");
        const formattedDateTo = timestampFormatter(dateTo, "2359");
        // Connect to MongoDB
        client = new MongoClient(uri);
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection(passesCollection);

        // Check if  tollnOpId and tagOpId are valid
        const tollOp = await db.collection(operatorsCollection)
            .findOne({ OpID: tollOpID });

        if (!tollOp) {
            const error = new Error("Invalid toll operator ID");
            error.status = 400;
            throw error;
        }

        // Query for passes data by tollOpID and date range
        const passData = await collection
            .aggregate([
                {
                    $match: {
                        tollID: { $regex: `^${tollOpID}` },
                        timestamp: { $gte: formattedDateFrom, $lte: formattedDateTo }
                    }
                },
                {
                    $group: {
                        _id: "$tagHomeID", // Group by visiting operator
                        nPasses: { $sum: 1 }, // Count total passes
                        passesCost: { $sum: "$charge" } // Sum total charges
                    }
                },
                { $sort: { _id: 1 } } // Sort by visiting operator
            ])
            .toArray();

        // Construct response
        return {
            tollOpID: tollOpID,
            requestTimestamp: currentTimestamp(),
            periodFrom: formattedDateFrom,
            periodTo: formattedDateTo,
            vOpList: passData.map(op => ({
                visitingOpID: op._id,
                nPasses: op.nPasses,
                passesCost: op.passesCost
            }))
        };
    } catch (error) {
        if (error.status === 400) {
            throw error;
        }
        throw new Error("Internal Server Error");
    } finally {
        if (client) {
            await client.close();
        }
    }
};