import React, { useState } from 'react';
import axios from 'axios';
import './ChargesBy.css'; // Import the CSS file for styling

function ChargesBy() {
  const [opid, setOpid] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const friendlyNames = {
    opid: "Operator ID",
    fromDate: "From Date",
    toDate: "To Date",
    // For fields that come from the API:
    vOpList: "Visiting Operator List",
    tollOpID: "Toll Operator ID",
    requestTimestamp: "Request Date",
    periodFrom: "From",
    periodTo: "To",
    // Add other mappings as needed.

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/chargesBy/${opid}/${fromDate}/${toDate}`;
      const response = await axios.get(url);
      setResult(response.data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.error || err.message || 'Error during chargesBy request');
    }
  };

  // Helper function to render a value nicely.
  const renderValue = (key, value) => {
    if (key === 'vOpList' && Array.isArray(value)) {
      return (
        <table className="inner-table">
          <thead>
            <tr>
              <th>Visiting Operator Tag</th>
              <th>Number of Passes</th>
              <th>Passes Cost</th>
            </tr>
          </thead>
          <tbody>
            {value.map((item, index) => (
              <tr key={index}>
                <td>{item.visitingOpID}</td>
                <td>{item.nPasses}</td>
                <td>{item.passesCost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (typeof value === 'object') {
      return <pre className="object-pre">{JSON.stringify(value, null, 2)}</pre>;
    }
    return value.toString();
  };

  return (
    <div className="charges-by-container">
      <h2>Charges By</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Operator ID:
          <input
            type="text"
            placeholder="OpID"
            value={opid}
            onChange={(e) => setOpid(e.target.value)}
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

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="result-container">
          <h3>Results:</h3>
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
                  <td>{friendlyNames[key] || key}</td>
                  <td>{renderValue(key, value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ChargesBy;
