import '../../App.css'
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Εισαγωγή όλων των admin σελίδων
import OperatorStatistics from './OperatorStatistics';
import OperatorFinancials from './OperatorFinancials';


function OperatorHomepage() {
  return (
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
  );
}

export default OperatorHomepage;
