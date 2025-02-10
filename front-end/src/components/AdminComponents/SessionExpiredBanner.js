// src/components/SessionExpiredBanner.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionExpiredBanner.css';

function SessionExpiredBanner() {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");

	// A simple function to decode a JWT and check expiration
	const isTokenExpired = (token) => {
		if (!token) return true;
		try {
			// Decode the JWT payload (assumes it's a base64 encoded JSON)
			const payload = JSON.parse(atob(token.split('.')[1]));
			const exp = payload.exp; // expiration time (in seconds since epoch)
			const now = Date.now() / 1000; // current time in seconds
			return exp < now;
		} catch (e) {
			// If an error occurs during decoding, assume token is invalid/expired.
			return true;
		}
	};

	if (!isTokenExpired(token)) {
		return null; // Token is still valid; no banner needed.
	}

	const handleClick = () => {
		// Clear authentication data and redirect to login
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("refreshToken");
		sessionStorage.removeItem("role");
		navigate("/");
	};

	return (
		<div className="session-expired-banner">
			<p>Your session has expired. Please log in again.</p>
			<button onClick={handleClick}>Go to Login</button>
		</div>
	);
}

export default SessionExpiredBanner;
