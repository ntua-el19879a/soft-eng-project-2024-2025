import React, { useState } from 'react';
import axios from 'axios';

const PassesCost = () => {
  const [tollOpID, setTollOpID] = useState('');
  const [tagOpID, setTagOpID] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [cost, setCost] = useState(null);
  const [error, setError] = useState(null);

  const fetchPassesCost = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9115/api/passesCost/${tollOpID}/${tagOpID}/${dateFrom}/${dateTo}`
      );
      setCost(response.data);
    } catch (error) {
      setError('Failed to fetch passes cost');
    }
  };

  return (
    <div>
      <h2>Passes Cost</h2>
      <input
        placeholder="Toll Operator ID"
        value={tollOpID}
        onChange={(e) => setTollOpID(e.target.value)}
      />
      <input
        placeholder="Tag Operator ID"
        value={tagOpID}
        onChange={(e) => setTagOpID(e.target.value)}
      />
      <input
        placeholder="From (YYYYMMDD)"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
      />
      <input
        placeholder="To (YYYYMMDD)"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
      />
      <button onClick={fetchPassesCost}>Fetch Passes Cost</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {cost ? (
        <pre>{JSON.stringify(cost, null, 2)}</pre>
      ) : (
        <p>No cost data available</p>
      )}
    </div>
  );
};

export default PassesCost;
