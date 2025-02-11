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
import UserManagement from './pages/AdminPages/UserManagement';
import TollStatsChartPage from './pages/AdminPages/TollStatsChartPage';

function App() {

  return (
    <Router>
      <div className="App">
        <h1>Highway Interoperability System</h1>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Route for the root path */}
          <Route path="/login" element={<Login />} /> {/* You might have this too, but "/" is root */}
          <Route path="/adminpage/*" element={<Admin />} />
          <Route path="/operatorpage/*" element={<Operator />} />
          <Route path="/passescost" element={<PassesCost />} />
          <Route path="/admin/healthcheck" element={<HealthCheck />} />
          <Route path="/admin/resetstations" element={<ResetStations />} />
          <Route path="/admin/resetpasses" element={<ResetPasses />} />
          <Route path="/admin/addpasses" element={<AddPasses />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/usermanagement" element={<UserManagement />} />
          <Route path="/chargesby" element={<ChargesBy />} />
          <Route path="/tollstationpasses" element={<TollStationPasses />} />
          <Route path="/passanalysis" element={<PassAnalysis />} />
          <Route path='/tollstatschartpie' element={<TollStatsChartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
