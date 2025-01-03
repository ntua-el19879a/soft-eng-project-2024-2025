// FOR TESTING PURPOSES ONLY

const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// Replace with your MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017';

async function main() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('toll-interop-db'); 
    const collection = database.collection('passes'); 

    // Read CSV file, skipping the header row
    const results = [];
    const stream = path.join(__dirname, '..', '..', '/dummy_data/data/passes-sample.csv')
    fs.createReadStream(stream)
      .pipe(csv())
      .on('headers', (headers) => { 
        // Store headers for potential future use
        console.log('Headers:', headers); 
      })
      .on('data', (row) => {
        // Convert charges to float
        row.charge = parseFloat(row.charge); 
        results.push(row);
      })
      .on('end', async () => {
        try {
          // Insert multiple documents
          const options = { ordered: false }; // Insert many documents in parallel
          await collection.insertMany(results, options);
          console.log(`${results.length} documents inserted successfully`);
        } catch (err) {
          console.error('Error inserting documents:', err);
        } finally {
          // Close MongoDB connection
          await client.close();
        }
      });
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
main();
