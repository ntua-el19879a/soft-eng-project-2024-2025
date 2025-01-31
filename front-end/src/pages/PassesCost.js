import React, { useState } from 'react';
import axios from 'axios';

function PassesCost() {
  // React state για τα input fields
  const [stationop, setstationop] = useState('');
  const [tagop, settagop] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // React state για το αποτέλεσμα και τα σφάλματα
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Συνάρτηση που “τρέχει” όταν πατάς το κουμπί της φόρμας
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Φτιάχνουμε το URL ακριβώς όπως είναι στο back-end:
      // π.χ. /api/PassesCost/AM/20220101/20220114
      const url = `/api/passesCost/${stationop}/${tagop}/${fromDate}/${toDate}`;

      // Κάνουμε GET αίτημα στο back-end μέσω του proxy
      const response = await axios.get(url);

      // Αποθηκεύουμε το αποτέλεσμα
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.message || 'Error during PassesCost request');
    }
  };

  return (
    <div>
      <h2>PassesCost</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Station Operator:
          <input
            type="text"
            placeholder='StationOp'
            value={stationop}
            onChange={(e) => setstationop(e.target.value)}
          />
        </label>
        <br />

        <label>
          Tag Operator:
          <input
            type="text"
            placeholder='TagOp'
            value={tagop}
            onChange={(e) => settagop(e.target.value)}
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

export default PassesCost;
