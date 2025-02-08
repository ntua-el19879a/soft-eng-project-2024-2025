import React, { useState } from 'react';
import axios from 'axios';
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
                navigate('/chargesby');

            } else if (response.data.role === 'operator') {
                navigate('/chargesby');
            } else {
                setError('Unknown role. Contact support.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />

                <label>
                    Password:
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />

                <button type="submit">Login</button>
            </form>

            {error && (
                <p style={{ color: 'red' }}>
                    <strong>Error:</strong> {error}
                </p>
            )}
        </div>
    );
}

export default Login;
