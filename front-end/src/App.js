import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των σελίδων
import PassesCost from './pages/PassesCost';
import HealthCheck from './pages/HealthCheck';
import ChargesBy from './pages/ChargesBy';
import TollStationPasses from './pages/TollStationPasses';
import PassAnalysis from './pages/PassAnalysis';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Highway Interoperability System</h1>

        <nav>
          <ul>
            <li><Link to="/passescost">Passes Cost</Link></li>
            <li><Link to="/chargesby">Charges By</Link></li>
            <li><Link to="/tollstationpasses">Toll Station Passes</Link></li>
            <li><Link to="/passanalysis">Pass Analysis</Link></li>
          <li><Link to="/healthcheck">Health Check</Link></li>
          </ul>
        </nav>

          <Routes>
          <Route path="/passescost" element={<PassesCost />} />
          <Route path="/healthcheck" element={<HealthCheck />} />
          <Route path="/chargesby" element={<ChargesBy />} />
          <Route path="/tollstationpasses" element={<TollStationPasses />} />
          <Route path="/passanalysis" element={<PassAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
