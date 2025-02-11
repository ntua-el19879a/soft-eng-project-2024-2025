const express = require('express');
const app = express();
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const authRoute = require('./routes/authRoute'); // 
const tollStationRoute = require('./routes/tollStationRoute');
const passAnalysisRoute = require('./routes/passAnalysisRoute');
const passesCostRoute = require('./routes/passesCostRoute');
const chargesByRoute = require('./routes/chargesByRoute');
const operatorFinancialsRoute = require('./routes/operatorFinancialsRoute');
const tollStatsRoute = require('./routes/tollStatsRoute');

app.use(express.json());

app.get('/admin/healthcheck', (req, res) => {
    res.redirect('/api/admin/healthcheck'); // Send 302 redirect to client
});

app.post('/admin/resetpasses', (req, res) => {
    // 307 status code preserves POST method during redirect
    res.redirect(307, '/api/admin/resetpasses');
});
app.post('/admin/resetstations', (req, res) => {
    // 307 status code preserves POST method during redirect
    res.redirect(307, '/api/admin/resetstations');
});



// Auth 
app.use('/', authRoute); // Login/logout

// Admin endpoints
app.use('/api/admin', adminRoutes);

app.get('/tollStationPasses/*', (req, res) => {
    const pathSegments = req.params[0];
    res.redirect(301, `/api/tollStationPasses/${pathSegments}`);
});
// Mount the route
app.use('/api/tollStationPasses', tollStationRoute);
app.use('/api/passAnalysis', passAnalysisRoute);
app.use('/api/passesCost', passesCostRoute);
app.use('/api/chargesBy', chargesByRoute);
app.use('/api/tollstats', tollStatsRoute);
app.use('api/operatorFinancials', operatorFinancialsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
