const { MongoClient } = require('mongodb');
const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment-timezone');
const { currentTimestamp, timestampFormatter } = require('../utils/timestampFormatter');
const { parse } = require('json2csv');
const { mongoUri } = require('../config/dbConfig');
const dbName = 'toll-interop-db';
const collections = {
    passes: 'passes',
    operators: 'operators',
    tollStations: 'tollstations',
    tags: 'tags'
};

const connectDB = async () => {
    return MongoClient.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    });
};

module.exports = {
    healthCheck: async () => {
        let client;
        try {
            client = await connectDB();
            const db = client.db(dbName);

            const [n_stations, n_tags, n_passes] = await Promise.all([
                db.collection(collections.tollStations).countDocuments(),
                db.collection(collections.tags).countDocuments(),
                db.collection(collections.passes).countDocuments()
            ]);

            return {
                status: 'OK',
                dbconnection: mongoUri,
                n_stations,
                n_tags,
                n_passes,
                timestamp: currentTimestamp()
            };
        } catch (error) {
            throw new Error(`Health check failed: ${error.message}`);
        } finally {
            if (client) await client.close();
        }
    },

    resetStations: async (filePath) => {
        let client;
        try {
            client = await connectDB();
            const db = client.db(dbName);
            const stations = [];
            const operators = new Map();

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        stations.push({
                            OpID: row.OpID,
                            Operator: row.Operator,
                            TollID: row.TollID,
                            Name: row.Name,
                            PM: row.PM,
                            Locality: row.Locality,
                            Road: row.Road,
                            Lat: parseFloat(row.Lat),
                            Long: parseFloat(row.Long),
                            Email: row.Email,
                            Prices: {
                                Price1: parseFloat(row.Price1),
                                Price2: parseFloat(row.Price2),
                                Price3: parseFloat(row.Price3),
                                Price4: parseFloat(row.Price4)
                            }
                        });

                        if (!operators.has(row.OpID)) {
                            operators.set(row.OpID, {
                                OpID: row.OpID,
                                Operator: row.Operator,
                                Email: row.Email
                            });
                        }
                    })
                    .on('end', async () => {
                        try {
                            await db.collection(collections.tollStations).deleteMany({});
                            await db.collection(collections.tollStations).insertMany(stations);

                            await db.collection(collections.operators).deleteMany({});
                            await db.collection(collections.operators).insertMany([...operators.values()]);

                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .on('error', reject);
            });
        } finally {
            if (client) await client.close();
        }
    },

    resetPasses: async () => {
        let client;
        try {
            client = await connectDB();
            const db = client.db(dbName);

            await Promise.all([
                db.collection(collections.passes).deleteMany({}),
                db.collection(collections.tags).deleteMany({})
            ]);
        } finally {
            if (client) await client.close();
        }
    },

    addPasses: async (filePath) => {
        let client;
        try {
            client = await connectDB();
            const db = client.db(dbName);
            const bulkPassOps = [];
            const bulkTagOps = [];
            const seenTags = new Set();

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv({
                        headers: ['timestamp', 'tollID', 'tagRef', 'tagHomeID', 'charge'],
                        skipLines: 1
                    }))
                    .on('data', (row) => {
                        try {
                            const timestamp = moment.tz(row.timestamp, 'M/D/YY HH:mm', 'UTC').toDate();

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
                            reject(err);
                        }
                    })
                    .on('end', async () => {
                        try {
                            if (bulkPassOps.length > 0) {
                                await db.collection(collections.passes).bulkWrite(bulkPassOps);
                            }
                            if (bulkTagOps.length > 0) {
                                await db.collection(collections.tags).bulkWrite(bulkTagOps);
                            }
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    })
                    .on('error', reject);
            });
        } finally {
            if (client) await client.close();
        }
    }
};
