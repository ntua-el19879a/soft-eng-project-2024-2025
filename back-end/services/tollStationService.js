// Interaction with MongoDB for toll station data
// Purpose: Contains business logic and operations that interact with the database or other external systems.
// Abstracts database queries and constructs the business response.

const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const dbName = "toll-interop-db";
const passesCollection = "passes";
const operatorsCollection = "operators";
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');
const { parse } = require('json2csv');


// Fetch passes from the database
exports.getTollStationPasses = async (tollStationID, dateFrom, dateTo, format = 'json') => {
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


    // No Content
    if (passes.length === 0) {
      return null;
    }

    // Construct the result
    const result = {
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

    // Convert to the requested format
    if (format === 'csv') {
      const csvFields = ['stationID', 'stationOperator', 'requestTimestamp', 'periodFrom', 'periodTo', 'nPasses', ...['passIndex', 'passID', 'timestamp', 'tagID', 'passCharge']];
      const csvData = result.passList.map(item => ({
        stationID: result.stationID,
        stationOperator: result.stationOperator,
        requestTimestamp: result.requestTimestamp,
        periodFrom: result.periodFrom,
        periodTo: result.periodTo,
        nPasses: passes.length,
        ...item
      }));
      return parse(csvData, { fields: csvFields }); // Convert JSON to CSV
    }

    return result;

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
