const express = require('express');
const tollStationRoute = require('./routes/tollStationRoute');

const app = express();
app.use(express.json());

// Mount the route
app.use('/api/tollStationPasses', tollStationRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
