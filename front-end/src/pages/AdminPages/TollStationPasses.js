import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../components/AdminComponents/TollStationPasses.css'; // Import the common form CSS
import { useNavigate } from "react-router-dom";

function TollStationPasses() {
  const [station, setStation] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    if (!token || !(role === "admin" || role === "operator")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `/api/tollStationPasses/${station}/${fromDate}/${toDate}`;
      const token = sessionStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in.");
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Station:</label>
          <input
            type="text"
            placeholder="Station"
            value={station}
            onChange={(e) => setStation(e.target.value)}
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
          <h3>Passes List</h3>
          {result.passList && result.passList.length > 0 ? (
            <table className="results-table">
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
                    <td>{pass.passIndex}.</td>
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
