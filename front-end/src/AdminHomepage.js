import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των admin σελίδων
import PassesCost from './pages/PassesCost';
import ChargesBy from './pages/ChargesBy';
import TollStationPasses from './pages/TollStationPasses';
import PassAnalysis from './pages/PassAnalysis';

function AdminHomepage() {
  return (
    <Router>
      <div className="App">
        <h1>Admin Dashboard</h1>

        <nav>
          <ul>
            <li><Link to="/passescost">Passes Cost</Link></li>
            <li><Link to="/chargesby">Charges By</Link></li>
            <li><Link to="/tollstationpasses">Toll Station Passes</Link></li>
            <li><Link to="/passanalysis">Pass Analysis</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/passescost" element={<PassesCost />} />
          <Route path="/chargesby" element={<ChargesBy />} />
          <Route path="/tollstationpasses" element={<TollStationPasses />} />
          <Route path="/passanalysis" element={<PassAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AdminHomepage;
