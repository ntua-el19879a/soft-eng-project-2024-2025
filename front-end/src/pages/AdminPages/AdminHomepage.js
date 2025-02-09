import '../../App.css';
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των admin σελίδων
import PassesCost from './PassesCost';
import ChargesBy from './ChargesBy';
import TollStationPasses from './TollStationPasses';
import PassAnalysis from './PassAnalysis';
import HealthCheck from '../AdminPages/HealthCheck';

function AdminHomepage() {
  return (
    <div className="App">
      <h1>Admin Dashboard</h1>

      <nav>
        <ul>
          <li><Link to="/passescost">Passes Cost</Link></li>
          <li><Link to="/chargesby">Charges By</Link></li>
          <li><Link to="/tollstationpasses">Toll Station Passes</Link></li>
          <li><Link to="/passanalysis">Pass Analysis</Link></li>
          <li><Link to="/healthcheck">HealthCheck</Link></li>
        </ul>
      </nav>

      {/* ✅ Only use <Routes> without <Router> */}
      <Routes>
        <Route path="/passescost" element={<PassesCost />} />
        <Route path="/chargesby" element={<ChargesBy />} />
        <Route path="/tollstationpasses" element={<TollStationPasses />} />
        <Route path="/passanalysis" element={<PassAnalysis />} />
        <Route path="/healthcheck" element={<HealthCheck />} />
      </Routes>
    </div>
  );
}

export default AdminHomepage;
