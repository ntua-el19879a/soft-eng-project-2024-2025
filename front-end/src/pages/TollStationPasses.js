import React, { useState } from 'react';
import axios from 'axios';

function TollStationPasses() {

  const [station, setStation] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = `/api/tollStationPasses/${station}/${fromDate}/${toDate}`;


      const response = await axios.get(url);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Error during tollStationPasses request');
    }
  };

  return (
    <div>
      <h2>TollStationPasses</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Station:
          <input
            type="text"
            placeholder='Station'
            value={station}
            onChange={(e) => setStation(e.target.value)}
          />
        </label>
        <br />

        <label>
          From:
          <input
            type="text"
            placeholder='YYYYMMDD'
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <br />

        <label>
          To:
          <input
            type="text"
            placeholder='YYYYMMDD'
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>

      {error && (
        <p style={{ color: 'red' }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Αποτελέσματα:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default TollStationPasses;
