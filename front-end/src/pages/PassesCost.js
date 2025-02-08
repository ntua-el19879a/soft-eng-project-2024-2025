import React, { useState } from 'react';
import axios from 'axios';
import './CommonForm.css'; // Import the common form CSS

function PassesCost() {
  const [stationop, setStationop] = useState('');
  const [tagop, setTagop] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/passesCost/${stationop}/${tagop}/${fromDate}/${toDate}`;
      const response = await axios.get(url);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.error || err.message || 'Error during PassesCost request');
    }
  };

  return (
    <div className="passes-cost-container">
      <h2>Passes Cost</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Station Operator:</label>
          <input
            type="text"
            placeholder="StationOp"
            value={stationop}
            onChange={(e) => setStationop(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Tag Operator:</label>
          <input
            type="text"
            placeholder="TagOp"
            value={tagop}
            onChange={(e) => setTagop(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>From:</label>
          <input
            type="text"
            placeholder="YYYYMMDD"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="text"
            placeholder="YYYYMMDD"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button type="submit">Submit</button>
        </div>
      </form>

      {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

      {result && (
        <div className="result-container">
          <h3>Cost Results:</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(result).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PassesCost;
