// Interaction with MongoDB for toll station data
// Purpose: Contains business logic and operations that interact with the database or other external systems.
// Abstracts database queries and constructs the business response.

const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const dbName = "toll-interop-db";
const passesCollection = "passes";
const operatorsCollection = "operators_v2";
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');

// Fetch passes from the database
exports.getTollStationPasses = async (tollStationID, dateFrom, dateTo) => {
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

    // Check if tollStationID is valid
    const operator = await db.collection(operatorsCollection)
      .findOne({ TollID: tollStationID });
    if (!operator) {
      const error = new Error("Invalid toll station ID");
      error.status = 400;
      throw error;
    }
    const operatorName = operator.OpID;

    // Query for passes in the date range for the specified toll station
    const passes = await collection
      .find({
        tollID: tollStationID,
        timestamp: { $gte: formattedDateFrom, $lte: formattedDateTo },
      })
      .sort({ timestamp: 1 }) // Sort by timestamp ascending
      .toArray();

    // Construct the result
    return {
      stationID: tollStationID,
      stationOperator: operatorName,
      requestTimestamp: currentTimestamp(),
      periodFrom: formattedDateFrom,
      periodTo: formattedDateTo,
      nPasses: passes.length,
      passList: passes.map((pass, index) => ({
        passIndex: index + 1,
        passID: pass._id,
        timestamp: pass.timestamp,
        tagID: pass.tagRef,
        tagProvider: pass.tagHomeID,
        passType: pass.tagHomeID === tollStationID ? "home" : "away",
        passCharge: pass.charge,
      })),
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
