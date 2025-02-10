import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Εισαγωγή όλων των σελίδων
import PassesCost from './pages/AdminPages/PassesCost';
import HealthCheck from './pages/AdminPages/HealthCheck';
import ChargesBy from './pages/AdminPages/ChargesBy';
import TollStationPasses from './pages/AdminPages/TollStationPasses';
import PassAnalysis from './pages/AdminPages/PassAnalysis';
import Login from './pages/Login';
import Admin from './pages/AdminPages/AdminHomepage';
import Operator from './pages/OperatorPages/OperatorHomepage';
import UsersList from './pages/AdminPages/UsersList';
import ResetStations from './pages/AdminPages/ResetStations';
import AddPasses from './pages/AdminPages/AddPasses';
import ResetPasses from './pages/AdminPages/ResetPasses';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Highway Interoperability System</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/adminpage/*" element={<Admin />} />
          <Route path="/operatorpage/*" element={<Operator />} />
          <Route path="/passescost" element={<PassesCost />} />
          <Route path="/healthcheck" element={<HealthCheck />} />
          <Route path="/resetstations" element={<ResetStations />} />
          <Route path="/resetpasses" element={<ResetPasses />} />
          <Route path="/addpasses" element={<AddPasses />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/chargesby" element={<ChargesBy />} />
          <Route path="/tollstationpasses" element={<TollStationPasses />} />
          <Route path="/passanalysis" element={<PassAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
