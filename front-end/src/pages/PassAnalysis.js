import React, { useState } from 'react';
import axios from 'axios';

function PassAnalysis() {
  const [stationOp, setStationOp] = useState('');
  const [tagOp, setTagOp] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/passAnalysis/${stationOp}/${tagOp}/${fromDate}/${toDate}`;
      const response = await axios.get(url);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.error || err.message || 'Error during passAnalysis request');
    }
  };

  return (
    <div className="pass-analysis-container">
      <h2>Pass Analysis</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Station Operator:
          <input
            type="text"
            placeholder="StationOp"
            value={stationOp}
            onChange={(e) => setStationOp(e.target.value)}
          />
        </label>
        <br />
        <label>
          Tag Operator:
          <input
            type="text"
            placeholder="TagOp"
            value={tagOp}
            onChange={(e) => setTagOp(e.target.value)}
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
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message"><strong>Error:</strong> {error}</div>}

      {result && (
        <div className="result-container">
          <h3>Analysis Results:</h3>
          <div className="summary">
            <p><strong>Station Operator:</strong> {result.stationOpID}</p>
            <p><strong>Tag Operator:</strong> {result.tagOpID}</p>
            <p><strong>Period:</strong> {result.periodFrom} to {result.periodTo}</p>
            <p><strong>Number of Passes:</strong> {result.nPasses}</p>
          </div>
          {result.passList && result.passList.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Pass ID</th>
                  <th>Station ID</th>
                  <th>Timestamp</th>
                  <th>Tag ID</th>
                  <th>Pass Charge</th>
                </tr>
              </thead>
              <tbody>
                {result.passList.map((pass) => (
                  <tr key={pass.passID}>
                    <td>{pass.passIndex}</td>
                    <td>{pass.passID}</td>
                    <td>{pass.stationID}</td>
                    <td>{pass.timestamp}</td>
                    <td>{pass.tagID}</td>
                    <td>{pass.passCharge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default PassAnalysis;
