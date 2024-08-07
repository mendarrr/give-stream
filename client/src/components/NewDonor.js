import React, { useState } from 'react';
import './NewDonor.css';


const NewDonorForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    is_anonymous: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.password.trim()) errors.password = 'Password is required';
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const postDonor = async (donorData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donorData),
      });

      if (!response.ok) {
        throw new Error('Failed to create donor');
      }

      const result = await response.json();
      console.log('Donor created:', result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error creating donor:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await postDonor(formData);
      if (result) {
        // Reset form after successful submission
        setFormData({
          username: '',
          email: '',
          password: '',
          is_anonymous: false,
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
            <p>We would like to know the donors who have visited our page and keep their records before making a donation.</p>
            <p>Kindly fill the form with the required details and choose whether you want to make your donations anonymously or not by ticking the checkbox.</p>
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
            <label className="form-label" htmlFor="email">Email:</label>
            <input
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
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
          <div className="form-group checkbox-container">
          <label className="form-label" htmlFor="is_anonymous">Anonymous:</label>
            <input
              className="form-checkbox"
              type="checkbox"
              id="is_anonymous"
              name="is_anonymous"
              checked={formData.is_anonymous}
              onChange={handleChange}
            />
          </div>
          <p>Already have an account?Signin</p>
          <p>By clicking the submit button below, you agree to the GiveStream Terms of Service and acknowledge the Privacy of notice.</p>
          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default NewDonorForm;