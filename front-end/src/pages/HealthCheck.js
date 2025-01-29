import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HealthCheck = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:9115/api/admin/healthcheck')
      .then(response => setData(response.data))
      .catch(error => setError('Failed to fetch health status'));
  }, []);

  return (
    <div>
      <h2>System Health Check</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data ? (
        <ul>
          {Object.entries(data).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HealthCheck;
