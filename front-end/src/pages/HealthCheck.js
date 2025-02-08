import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HealthCheck.css'; // Import a dedicated CSS file for this component

function HealthCheck() {
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/healthcheck')
      .then(response => {
        setHealthData(response.data);
        setError(null);
      })
      .catch(error => {
        console.error('HealthCheck error:', error);
        setError('Error fetching health check data.');
      });
  }, []);

  return (
    <div className="health-check-container">
      <h2>System Health Check</h2>
      {error && <div className="error-message">{error}</div>}
      {healthData ? (
        <div className="health-check-card">
          <div className="health-check-row">
            <span className="health-check-label">Status:</span>
            <span className="health-check-value">{healthData.status}</span>
          </div>
          <div className="health-check-row">
            <span className="health-check-label">Database Connection:</span>
            <span className="health-check-value">{healthData.dbconnection}</span>
          </div>
          <div className="health-check-row">
            <span className="health-check-label">Toll Stations:</span>
            <span className="health-check-value">{healthData.n_stations}</span>
          </div>
          <div className="health-check-row">
            <span className="health-check-label">Tags:</span>
            <span className="health-check-value">{healthData.n_tags}</span>
          </div>
          <div className="health-check-row">
            <span className="health-check-label">Passes:</span>
            <span className="health-check-value">{healthData.n_passes}</span>
          </div>
          <div className="health-check-row">
            <span className="health-check-label">Timestamp:</span>
            <span className="health-check-value">{healthData.timestamp}</span>
          </div>
        </div>
      ) : (
        <p>Loading health check data...</p>
      )}
    </div>
  );
}

export default HealthCheck;
