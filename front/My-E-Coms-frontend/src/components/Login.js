import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        navigate('/dashboard'); // Redirect to the dashboard

        // Uncomment below for actual API integration
        // try {
        //     const response = await fetch('http://127.0.0.1:8000/api/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email, password })
        //     });
        //     if (!response.ok) {
        //         const errorData = await response.json();
        //         throw new Error(errorData.message || 'Login failed');
        //     }
        //     const data = await response.json();
        //     localStorage.setItem('token', data.token);
        //     alert('Login successful!');
        //     navigate('/dashboard');
        // } catch (err) {
        //     setError(err.message);
        // }
    };

    return (
        <div className="login-container">
            <div className="left-section">
                <img src="/logo.png" alt="Logo" className="logo" />
                <h1 className="store-title">Welcome to MyStore</h1>
                <p className="tagline">The leading online shopping platform in Cabuyao Laguna</p>
            </div>
            <div className="right-section">
                <div className="login-card">
                    <h2 className="login-title">Sign In</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="login-btn" type="submit">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
