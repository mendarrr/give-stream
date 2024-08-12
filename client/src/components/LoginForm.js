import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send login request to the backend
      const response = await axios.post('/login', {
        username,
        password
      });

      // Extract the access token and user role from the response
      const { access_token, role } = response.data;

      // Store the access token and user role in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);

      // Redirect based on the user role
      switch (role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'donor':
          navigate('/charity-dashboard');
          break;
        case 'charity':
          navigate('/charity-profile');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      // Handle errors, providing feedback to the user
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;
