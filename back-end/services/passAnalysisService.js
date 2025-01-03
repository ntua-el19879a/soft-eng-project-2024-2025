const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const dbName = 'toll-interop-db';
const passesCollection = 'passes';
const operatorsCollection = "operators_v2";
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');

exports.getPassAnalysisData = async (stationOpID, tagOpID, dateFrom, dateTo) => {
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

        // Check if  stationOpId and tagOpId are valid
        const stationOp = await db
            .collection(operatorsCollection)
            .findOne({ OpID: stationOpID });

        const tagOp = await db
            .collection(operatorsCollection)
            .findOne({ OpID: tagOpID });

        if (!stationOp) {
            const error = new Error("Invalid  station operator ID");
            error.status = 400;
            throw error;
        }
        if (!tagOp) {
            const error = new Error("Invalid tag operator ID");
            error.status = 400;
            throw error;
        }

        // Query for pass data
        const passData = await collection
            .find({
                tollID: { $regex: `^${stationOp}` },
                tagHomeID: tagOpID,
                timestamp: { $gte: formattedDateFrom, $lte: formattedDateTo },
            })
            .sort({ timestamp: 1 }) // Sort by timestamp ascending
            .toArray();


        // Construct the response
        return {
            stationOpID: stationOpID,
            tagOpID: tagOpID,
            requestTimestamp: currentTimestamp(),
            periodFrom: formattedDateFrom,
            periodTo: formattedDateTo,
            nPasses: passData.length,
            passList: passData.map((pass, index) => ({
                passIndex: index + 1,
                passID: pass._id,
                stationID: pass.tollID,
                timestamp: pass.timestamp,
                tagID: pass.tagRef,
                passCharge: pass.charge,
            }))
        };
    } catch (error) {
        if (error.status === 400) {
            throw error;
        }
        throw new Error("Internal Server Error");
    } finally {
        // Ensure client is closed
        if (client) {
            await client.close();
        }
    }
};