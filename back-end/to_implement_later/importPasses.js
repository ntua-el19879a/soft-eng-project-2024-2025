const csv = require('csv-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const moment = require('moment-timezone');

const mongoURI = "mongodb://127.0.0.1:27017";
const dbName = 'toll-interop-db';

async function importPasses() {
    const client = new MongoClient(mongoURI);

    try {
        // 1. Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);

        // 2. Initialize collections
        const passesCollection = db.collection('passes');
        const tagsCollection = db.collection('tags');
        await passesCollection.deleteMany({}); // Optional: Clear existing data
        await tagsCollection.deleteMany({});   // Optional: Clear existing data

        // 3. Prepare bulk operations arrays
        const bulkPassOps = [];
        const bulkTagOps = [];
        const seenTags = new Set(); // Track unique tags

        // 4. Process CSV
        await new Promise((resolve, reject) => {
            fs.createReadStream('passes-sample.csv')
                .pipe(csv({
                    headers: ['timestamp', 'tollID', 'tagRef', 'tagHomeID', 'charge'],
                    skipLines: 1,
                    trim: true
                }))
                .on('data', (row) => {
                    try {
                        // Parse timestamp (M/D/YY HH:mm)
                        const timestamp = moment.tz(row.timestamp, 'M/D/YY HH:mm', 'UTC').toDate();

                        // Add pass to bulk operations
                        bulkPassOps.push({
                            insertOne: {
                                document: {
                                    timestamp,
                                    tollID: row.tollID.trim(),
                                    tagRef: row.tagRef.trim(),
                                    tagHomeID: row.tagHomeID.trim(),
                                    charge: parseFloat(row.charge)
                                }
                            }
                        });

                        // Track unique tags
                        const tagKey = `${row.tagRef.trim()}-${row.tagHomeID.trim()}`;
                        if (!seenTags.has(tagKey)) {
                            seenTags.add(tagKey);
                            bulkTagOps.push({
                                updateOne: {
                                    filter: { tagRef: row.tagRef.trim() },
                                    update: { $setOnInsert: { tagHomeID: row.tagHomeID.trim() } },
                                    upsert: true
                                }
                            });
                        }
                    } catch (err) {
                        console.error('Error processing row:', err);
                    }
                })
                .on('end', async () => {
                    try {
                        // 5. Execute bulk operations
                        if (bulkPassOps.length > 0) {
                            await passesCollection.bulkWrite(bulkPassOps, { ordered: false });
                            console.log(`Inserted ${bulkPassOps.length} passes`);
                        }

                        if (bulkTagOps.length > 0) {
                            await tagsCollection.bulkWrite(bulkTagOps, { ordered: false });
                            console.log(`Processed ${bulkTagOps.length} tags`);
                        }

                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                })
                .on('error', reject);
        });

    } catch (err) {
        console.error('Import failed:', err);
    } finally {
        // 6. Close connection ONLY after all operations
        await client.close();
        console.log('MongoDB connection closed');
    }
}

importPasses();
