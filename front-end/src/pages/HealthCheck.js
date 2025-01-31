import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HealthCheck() {
 
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    axios.get('/api/admin/healthcheck')
      .then(response => {
        setHealthData(response.data);
      })
      .catch(error => {
        console.error('HealthCheck error:', error);
      });
  }, []);

  return (
    <div>
      <h2>HealthCheck</h2>
      {healthData ? (
        <pre>{JSON.stringify(healthData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default HealthCheck;
