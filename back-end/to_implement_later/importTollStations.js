const csv = require('csv-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');

const mongoURI = 'mongodb://localhost:27017';
const dbName = 'toll-interop-db';
const client = new MongoClient(mongoURI);

async function importPasses() {
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to MongoDB');

        const passesCollection = db.collection('passes'); // Use the passes collection
        await passesCollection.deleteMany({}); // Clear the collection before importing

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
                        timestamp: timestamp.toDate(),
                        tollID: row['tollID']?.trim(),
                        tagRef: row['tagRef']?.trim(),
                        tagHomeID: row['tagHomeID']?.trim(),
                        charge: parseFloat(row['charge']),
                    };

                    // Insert the pass directly into the passes collection
                    await passesCollection.insertOne(pass);

                    console.log(`Inserted pass: ${pass.tollID} at ${pass.timestamp}`);
                })();
                promises.push(promise);
            })
            .on('end', async () => {
                await Promise.all(promises); // Wait for all async operations to complete
                console.log('Finished processing CSV file.');
                client.close();
            })
            .on('error', (err) => {
                console.error('Error reading CSV file:', err);
                client.close();
            });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    } finally {
        console.log('MongoDB connection closed');
    }
}

importPasses();
