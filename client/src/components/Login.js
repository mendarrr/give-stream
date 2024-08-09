import React, { useState } from 'react';
import './NewDonor.css';


const LogInForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''    
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
    }));
    // Clear error for this field when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
      

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const logIn = async (logInData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logInData),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const result = await response.json();
      console.log('Login successful:', result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error logging in:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await logIn(formData);
      if (result) {
        // Reset form after successful submission
        setFormData({
          username: '',
          password: ''
        });
      }
    }
  };

  return (
    <div className='newDonor'>
    <div className="form-page">
      <div className="form-left">
        <img src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png" alt="GiveStream Logo" className="logo" />
      </div>
      <div className="form-right" style={{
          backgroundImage: `url('/photo.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backgroundBlendMode: 'overlay',}}>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <h2>WELCOME TO GIVE STREAM</h2>
            <p>Connect with charities and help the world.</p>
            <label className="form-label" htmlFor="username">Username:</label>
            <input
              className={`form-input ${formErrors.username ? 'error' : ''}`}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {formErrors.username && <span className="error-message">{formErrors.username}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password:</label>
            <input
              className={`form-input ${formErrors.password ? 'error' : ''}`}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>
          <p>Don't have an account?SignUp</p>
          <p>By clicking the submit button below, you agree to the GiveStream Terms of Service and acknowledge the Privacy of notice.</p>
          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default LogInForm;