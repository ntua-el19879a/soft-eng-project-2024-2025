// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 9115;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/toll-interop-db';
mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Pass = mongoose.model(
  'Pass',
  new mongoose.Schema(
    {
      timestamp: Date,
      tollID: String,
      tagRef: String,
      tagHomeID: String,
      charge: Number,
    },
    { collection: 'passes' }
  )
);

const TollStation = mongoose.model(
  'TollStation',
  new mongoose.Schema(
    {
      OpID: String,
      Operator: String,
      TollID: String,
      Name: String,
      PM: String,
      Locality: String,
      Road: String,
      Lat: Number,
      Long: Number,
      Email: String,
      Prices: {
        Price1: Number,
        Price2: Number,
        Price3: Number,
        Price4: Number,
      },
    },
    { collection: 'toll_stations' }
  )
);

// MongoDB Models
const TollStationPass = mongoose.model(
  'TollStationPass',
  new mongoose.Schema({
    stationID: String,
    stationOperator: String,
    nPasses: Number,
    passList: [
      {
        passIndex: Number,
        passID: String,
        timestamp: Date,
        tagID: String,
        tagProvider: String,
        passType: String,
        passCharge: Number,
      },
    ],
  },
    { collection: 'tollStationPasses' }
  )
);

const Operator = mongoose.model(
  'Operator',
  new mongoose.Schema({
    OpID: String,
    Operator: String,
    Email: String,
  })
);

// Healthcheck Endpoint
app.get('/api/admin/healthcheck', async (req, res) => {
  try {
    // Count total stations
    const nStations = await TollStation.countDocuments();

    // Count total tags (from the Operator model)
    const nTags = await Operator.countDocuments();

    const nPasses = await Pass.countDocuments();

    res.status(200).json({
      status: 'OK',
      dbconnection: mongoURI,
      n_stations: nStations,
      n_tags: nTags,
      n_passes: nPasses, // Correctly calculated total passes
    });
  } catch (err) {
    console.error('Healthcheck error:', err);
    res.status(500).json({ status: 'failed', dbconnection: mongoURI });
  }
});

// Reset Stations Endpoint
app.post('/api/admin/resetstations', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ status: 'failed', info: 'CSV file not provided.' });
  }

  try {
    const tollStations = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        tollStations.push({
          OpID: row['OpID'],
          Operator: row['Operator'],
          TollID: row['TollID'],
          Name: row['Name'],
          PM: row['PM'],
          Locality: row['Locality'],
          Road: row['Road'],
          Lat: parseFloat(row['Lat']),
          Long: parseFloat(row['Long']),
          Email: row['Email'],
          Prices: {
            Price1: parseFloat(row['Price1']),
            Price2: parseFloat(row['Price2']),
            Price3: parseFloat(row['Price3']),
            Price4: parseFloat(row['Price4']),
          },
        });
      })
      .on('end', async () => {
        try {
          await TollStation.deleteMany({});
          await TollStation.insertMany(tollStations);
          res.status(200).json({ status: 'OK' });
        } catch (err) {
          console.error('Error saving stations:', err);
          res.status(500).json({ status: 'failed', info: err.message });
        } finally {
          fs.unlinkSync(filePath);
        }
      });
  } catch (err) {
    console.error('Error reading CSV file:', err);
    res.status(500).json({ status: 'failed', info: err.message });
  }
});
// Reset Passes Endpoint
app.post('/api/admin/resetpasses', async (req, res) => {
  try {
    await Pass.deleteMany({});
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    res.status(500).json({ status: 'failed', info: err.message });
  }
});

// Get Toll Station Passes Endpoint
app.get('/api/passes/:tollID/:date_from/:date_to', async (req, res) => {
  const { tollID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const passes = await Pass.find({
      tollID,
      timestamp: { $gte: new Date(date_from), $lte: new Date(date_to) },
    }).sort({ timestamp: 1 });

    if (format === 'csv') {
      const csv = passes
        .map((pass) => Object.values(pass).join(','))
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csv);
    }

    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pass Analysis Endpoint
app.get('/api/passAnalysis/:stationOpID/:tagOpID/:date_from/:date_to', async (req, res) => {
  const { stationOpID, tagOpID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const passes = await TollStationPass.find({
      stationOperator: stationOpID,
      'passList.tagProvider': tagOpID,
      'passList.timestamp': { $gte: new Date(date_from), $lte: new Date(date_to) },
    }).sort({ 'passList.timestamp': 1 });

    if (format === 'csv') {
      const csv = passes
        .flatMap((doc) => doc.passList)
        .map((pass) => Object.values(pass).join(','))
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csv);
    }

    res.json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Passes Cost Endpoint
app.get('/api/passesCost/:tollOpID/:tagOpID/:date_from/:date_to', async (req, res) => {
  const { tollOpID, tagOpID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const passes = await TollStationPass.find({
      stationOperator: tollOpID,
      'passList.tagProvider': tagOpID,
      'passList.timestamp': { $gte: new Date(date_from), $lte: new Date(date_to) },
    });

    const totalCost = passes.reduce(
      (sum, pass) =>
        sum +
        pass.passList.reduce((innerSum, p) => innerSum + p.passCharge, 0),
      0
    );

    if (format === 'csv') {
      const csv = `Total Cost,${totalCost}`;
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csv);
    }

    res.json({ totalCost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Charges By Endpoint
app.get('/api/chargesBy/:tollOpID/:date_from/:date_to', async (req, res) => {
  const { tollOpID, date_from, date_to } = req.params;
  const format = req.query.format || 'json';

  try {
    const passes = await TollStationPass.find({
      stationOperator: tollOpID,
      'passList.timestamp': { $gte: new Date(date_from), $lte: new Date(date_to) },
    });

    const charges = passes.reduce((acc, pass) => {
      pass.passList.forEach((p) => {
        if (!acc[p.tagProvider]) acc[p.tagProvider] = 0;
        acc[p.tagProvider] += p.passCharge;
      });
      return acc;
    }, {});

    if (format === 'csv') {
      const csv = Object.entries(charges)
        .map(([tagProvider, cost]) => `${tagProvider},${cost}`)
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      return res.send(csv);
    }

    res.json(charges);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
