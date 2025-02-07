const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const authRoute = require('./routes/authRoute'); // 
const tollStationRoute = require('./routes/tollStationRoute');
const passAnalysisRoute = require('./routes/passAnalysisRoute');
const passesCostRoute = require('./routes/passesCostRoute');
const chargesByRoute = require('./routes/chargesByRoute');

app.use(express.json());

// Auth 
app.use('/api/auth', authRoute); // Login/logout

// Admin endpoints
app.use('/api/admin', adminRoutes);

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
