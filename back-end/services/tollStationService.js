// Interaction with MongoDB for toll station data

const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'toll-interop-db';
const collectionName = 'passes';

// Fetch passes from the database
exports.getTollStationPasses = async (tollStationID, dateFrom, dateTo) => {
    let client;
    try {

        // Validate date format
        const dateRegex = /^\d{4}\d{2}\d{2}$/;
        if (!dateRegex.test(dateFrom) || !dateRegex.test(dateTo)) {
            throw new Error('Invalid date format. Dates must be in YYYYMMDD format.');
        }

        //TODO: check if tollStationID is a valid toll station ID

        // Convert dateFrom and dateTo to YYYY-MM-DD HH:MM format
        const formattedDateFrom = `${dateFrom.slice(0, 4)}-${dateFrom.slice(4, 6)}-${dateFrom.slice(6, 8)} 00:00`;
        const formattedDateTo = `${dateTo.slice(0, 4)}-${dateTo.slice(4, 6)}-${dateTo.slice(6, 8)} 23:59`;

        if (formattedDateFrom > formattedDateTo) {
            throw new Error('Invalid date range. The start date must be before the end date.');
        }
        // Connect to MongoDB
        client = new MongoClient(uri);
        await client.connect();

        // Get the collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Query for passes in the date range for the specified toll station
        const passes = await collection
            .find({
                tollID: tollStationID,
                timestamp: { $gte: formattedDateFrom, $lte: formattedDateTo }
            },
            )
            .sort({ timestamp: 1 }) // Sort by timestamp ascending
            .toArray();


        // Construct the result
        return {
            stationID: tollStationID,
            periodFrom: dateFrom,
            periodTo: dateTo,
            nPasses: passes.length,
            passList: passes.map((pass, index) => ({
                passIndex: index + 1,
                passID: pass._id,
                timestamp: pass.timestamp,
                tagID: pass.tagRef,
                tagProvider: pass.tagHomeID,
                passType: (pass.tagHomeID === tollStationID.slice(0, pass.tagHomeID.length)) ? "home" : "away",
                passCharge: pass.charge
            }))
        };
    } catch (error) {
        return { error: error.message };
    } finally {
        // Ensure client is closed
        if (client) {
            await client.close();
        }
    }
};
