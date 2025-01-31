import React, { useState } from 'react';
import axios from 'axios';

function ChargesBy() {

  const [opid, setOpid] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');


  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/chargesBy/${opid}/${fromDate}/${toDate}`;


      const response = await axios.get(url);

      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Error during chargesBy request');
    }
  };

  return (
    <div>
      <h2>ChargesBy</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Operator ID:
          <input
            type="text"
            placeholder='OpID'
            value={opid}
            onChange={(e) => setOpid(e.target.value)}
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

export default ChargesBy;
