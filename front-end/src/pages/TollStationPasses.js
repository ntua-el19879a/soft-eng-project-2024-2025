import React, { useState } from 'react';
import axios from 'axios';

const TollStationPasses = () => {
  const [tollID, setTollID] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [passes, setPasses] = useState([]);
  const [error, setError] = useState(null);

  const fetchPasses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9115/api/tollStationPasses/${tollID}/${dateFrom}/${dateTo}`
      );
      setPasses(response.data);
    } catch (error) {
      setError('Failed to fetch toll station passes');
    }
  };

  return (
    <div>
      <h2>Toll Station Passes</h2>
      <input
        placeholder="Toll ID"
        value={tollID}
        onChange={(e) => setTollID(e.target.value)}
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
      <button onClick={fetchPasses}>Fetch Passes</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {passes.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Toll ID</th>
              <th>Vehicle Tag</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass, index) => (
              <tr key={index}>
                <td>{pass.timestamp}</td>
                <td>{pass.tollID}</td>
                <td>{pass.tagRef}</td>
                <td>{pass.charge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No passes found</p>
      )}
    </div>
  );
};

export default TollStationPasses;
