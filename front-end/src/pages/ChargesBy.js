import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ChargesBy() {

  const [opid, setOpid] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  // Check authentication and role
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token || !(role === "admin" || role === "operator")) {
      // Redirect to login if unauthorized
      navigate("/");
    }
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const url = `/api/chargesBy/${opid}/${fromDate}/${toDate}`;
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
