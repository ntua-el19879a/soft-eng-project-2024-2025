import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/CommonForm.css'; // Import the common form CSS
import { useNavigate } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `/api/auth/login`;
            const response = await axios.post(url, { username, password });

            sessionStorage.setItem("token", response.data.accessToken);
            sessionStorage.setItem("refreshToken", response.data.refreshToken);
            sessionStorage.setItem("role", response.data.role);

            if (response.data.role === 'admin') {
                navigate('/adminpage');
            } else if (response.data.role === 'operator') {
                navigate('/operatorpage');
            } else {
                setError('Unknown role. Contact support.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"> Password:</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="button-group">
                    <button type="submit">Login</button>
                </div>
            </form>
            {error && (
                <p className="error-message">
                    <strong>Error:</strong> {error}
                </p>
            )}
        </div>
    );
}

export default Login;
