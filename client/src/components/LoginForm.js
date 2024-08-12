import React, { useState } from "react";
import axios from "axios";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send login request to the backend
      const response = await axios.post("/login", {
        username,
        password,
      });

      // Extract the access token and user role from the response
      const { access_token, role } = response.data;

      // Store the access token and user role in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);

      console.log('Response data:', response.data);
      console.log('Extracted role:', role);

      // Redirect based on the user role
      switch (role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case 'donor':
          navigate('/donation-form');
          break;
        case 'charity':
          navigate('/charity-profile');
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      // Handle errors, providing feedback to the user
      setError("Invalid credentials. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="form-page">
      <div className="login-logo form-left">
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`}
            alt="logo"
          />
        </Link>
      </div>
      <div className="form-right">
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-header">
            <h3>Enter Your Account Details</h3>
          </div>
          <div className="form-group">
            <input
              type="name"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <div className="login">
            <p><Link to="" className="llink">Forgot your password?</Link></p>
            <p>
            You don't have an account?
            <Link to="/donor" className="link">Sign Up</Link>
            </p>
          </div>
          <div className="accept">
              <p>
              By clicking the Sign In button below, you agree to the Give Stream
              <Link to="/terms" className="link">Terms of Service</Link> and acknowledge the <Link to="/privacy" className="link">Privacy Notice</Link>.
            </p>
              </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginPage;
