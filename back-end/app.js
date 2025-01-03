const express = require('express');
const app = express();

const tollStationRoute = require('./routes/tollStationRoute');
const passAnalysisRoute = require('./routes/passAnalysisRoute');
const passesCostRoute = require('./routes/passesCostRoute');
const chargesByRoute = require('./routes/chargesByRoute');

app.use(express.json());

// Mount the route
app.use('/api/tollStationPasses', tollStationRoute);
app.use('/api/passAnalysis', passAnalysisRoute);
app.use('/api/passesCost', passesCostRoute);
app.use('/api/chargesBy', chargesByRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;