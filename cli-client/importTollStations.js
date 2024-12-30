const csv = require('csv-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'toll-interop-db';
const client = new MongoClient(mongoURI);

async function importTollStations() {
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to MongoDB');

        const tollStationPasses = db.collection('tollStationPasses');
        await tollStationPasses.deleteMany({});
        const promises = [];

        const stream = fs.createReadStream('passes-sample.csv')
        .pipe(csv({ headers: ['timestamp', 'tollID', 'tagRef', 'tagHomeID', 'charge'], trim: true }))
        .on('data', (row) => {
            const promise = (async () => {
                console.log('Row data:', row); // Debug row data

                const rawTimestamp = row['timestamp']?.trim();
                if (!rawTimestamp) {
                    console.error('Timestamp is missing or undefined:', row);
                    return;
                }

                let timestamp = moment.tz(rawTimestamp, 'M/D/YY HH:mm', 'UTC');
                if (!timestamp.isValid()) {
                    console.error('Skipping row with invalid timestamp:', row);
                    return;
                }

                const pass = {
                    passIndex: Date.now(),
                    passID: row['tagRef']?.trim(),
                    timestamp: timestamp.toDate(),
                    tollID: row['tollID']?.trim(),
                    tagProvider: row['tagHomeID']?.trim(),
                    passType: 'default',
                    passCharge: parseFloat(row['charge']),
                };
                await tollStationPasses.updateOne(
                    { stationID: row['tollID']?.trim() },
                    {
                        $push: { passList: pass }, // Add to the passList array
                        $inc: { nPasses: 1 }, // Increment nPasses count
                    },
                    { upsert: true }
                );

                console.log(`Inserted pass: ${pass.tollID} at ${pass.timestamp}`);
            })();
            promises.push(promise);
        })
        .on('end', async () => {
            await Promise.all(promises);
            console.log('Finished processing CSV file.');
            client.close();
        })
        .on('error', (err) => {
            console.error("Error");
            client.close();
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
    finally {
        console.log('MongoDb connection closed');
    }
}

importTollStations();
