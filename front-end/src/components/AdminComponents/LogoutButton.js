// LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
	const navigate = useNavigate();

	const handleLogout = () => {
		// Clear session storage items
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("refreshToken");
		sessionStorage.removeItem("role");
		// Immediately navigate to the login page
		navigate("/login");
	};

	return (
		<button onClick={handleLogout} className="logout-button">
			Logout
		</button>
	);
}

export default LogoutButton;
