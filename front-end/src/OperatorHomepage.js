import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των admin σελίδων
import OperatorStatistics from './pages/OperatorStatistics';
import OperatorFinancials from './pages/OperatorFinancials';

function OperatorHomepage() {
  return (
    <Router>
      <div className="App">
        <h1>Operator Dashboard</h1>

        <nav>
          <ul>
            <li><Link to="/OperatorStatistics">Statistics</Link></li>
            <li><Link to="/OperatorFinancials">Financials</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/OperatorStatistics" element={<OperatorStatistics />} />
          <Route path="/OperatorFinancials" element={<OperatorFinancials />} />
        </Routes>
      </div>
    </Router>
  );
}

export default OperatorHomepage;
