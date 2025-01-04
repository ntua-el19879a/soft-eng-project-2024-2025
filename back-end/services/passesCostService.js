const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const dbName = 'toll-interop-db';
const passesCollection = 'passes';
const operatorsCollection = 'operators_v2';
const { parse } = require('json2csv');
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');


exports.getPassesCostData = async (tollOpID, tagOpID, dateFrom, dateTo, format = 'json') => {
    let client;

    try {

        // Convert dateFrom and dateTo to YYYY-MM-DD HH:MM format
        const formattedDateFrom = timestampFormatter(dateFrom, "0000");
        const formattedDateTo = timestampFormatter(dateTo, "2359");

        // Connect to MongoDB
        client = new MongoClient(uri);
        await client.connect();

        // Get the collection
        const db = client.db(dbName);
        const collection = db.collection(passesCollection);

        // Check if  tollnOpId and tagOpId are valid
        const tollOp = await db.collection(operatorsCollection)
            .findOne({ OpID: tollOpID });
        const tagOp = await db.collection(operatorsCollection)
            .findOne({ OpID: tagOpID });
        if (!tollOp) {
            const error = new Error("Invalid  station operator ID");
            error.status = 400;
            throw error;
        }
        if (!tagOp) {
            const error = new Error("Invalid tag operator ID");
            error.status = 400;
            throw error;
        }

        // Query for passes data between two operators
        const passData = await collection
            .find({
                tollID: { $regex: `^${tollOpID}` },
                tagHomeID: tagOpID,
                timestamp: { $gte: formattedDateFrom, $lte: formattedDateTo },
            })
            .toArray();

        // No Content
        if (passData.length === 0) {
            return null;
        }


        // Calculate total cost
        const totalCost = passData.reduce((sum, pass) => sum + (pass.charge || 0), 0);
        const result = {
            tollOpID: tollOpID,
            tagOpID: tagOpID,
            requestTimestamp: currentTimestamp(),
            periodFrom: formattedDateFrom,
            periodTo: formattedDateTo,
            nPasses: passData.length,
            passesCost: totalCost
        };

        if (format === 'csv') {
            const csvFields = ['tollOpID', 'tagOpID', 'requestTimestamp', 'periodFrom', 'periodTo', 'nPasses', 'passesCost'];
            return parse(result, { fields: csvFields });
        }
        return result;

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