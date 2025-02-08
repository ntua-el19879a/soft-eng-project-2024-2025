import React, { useState } from 'react';
import axios from 'axios';
import './TollStationPasses.css';

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
      setError(err.response?.data?.error || err.message || 'Error during tollStationPasses request');
    }
  };

  return (
    <div className="toll-station-passes-container">
      <h2>Toll Station Passes</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Station:
          <input
            type="text"
            placeholder="Station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          />
        </label>
        <br />
        <label>
          From:
          <input
            type="text"
            placeholder="YYYYMMDD"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          To:
          <input
            type="text"
            placeholder="YYYYMMDD"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <br /><br />
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

      {result && (
        <div className="result-container">
          <h3>Passes List</h3>
          {result.passList && result.passList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Pass ID</th>
                  <th>Timestamp</th>
                  <th>Tag ID</th>
                  <th>Operator Tag</th>
                  <th>Pass Type</th>
                  <th>Pass Charge</th>
                </tr>
              </thead>
              <tbody>
                {result.passList.map((pass) => (
                  <tr key={pass.passID}>
                    <td>{pass.passIndex}{'.'}</td>
                    <td>{pass.passID}</td>
                    <td>{pass.timestamp}</td>
                    <td>{pass.tagID}</td>
                    <td>{pass.tagProvider}</td>
                    <td>{pass.passType}</td>
                    <td>{pass.passCharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No passes found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TollStationPasses;
