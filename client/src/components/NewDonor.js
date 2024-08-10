import React, { useState } from "react";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";

const NewDonorForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    is_anonymous: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password.trim()) errors.password = "Password is required";

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const postDonor = async (donorData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/donors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donorData),
      });

      if (!response.ok) {
        throw new Error("Failed to create donor");
      }

      const result = await response.json();
      console.log("Donor created:", result);
      return result;
    } catch (err) {
      setError(err.message);
      console.error("Error creating donor:", err);
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
          username: "",
          email: "",
          password: "",
          is_anonymous: false,
        });
        navigate("/signin");
      }
    }
  };

  return (
    <div className="newDonor">
      <div className="form-page">
        <div className="form-left">
          <img
            src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
            alt="GiveStream Logo"
            className="logo"
          />
        </div>
        <div
          className="form-right"
          style={{
            backgroundImage: `url('/photo.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backgroundBlendMode: "overlay",
          }}
        >
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="form-text">
              <h2>WELCOME TO GIVE STREAM</h2>
              <p>Connect with charities and help the world.</p>
            </div>
            <div className="form-group">
              <input
                className={`form-input ${formErrors.username ? "error" : ""}`}
                type="name"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Username"
              />
              {formErrors.username && (
                <span className="error-message">{formErrors.username}</span>
              )}
            </div>
            <div className="form-group">
              <input
                className={`form-input  ${formErrors.email ? "error" : ""}`}
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>
            <div className="form-group">
              <input
                className={`form-input ${formErrors.password ? "error" : ""}`}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>
            <div className="checkbox-container">
              <label className="form-label" htmlFor="is_anonymous">
                Anonymous:
              </label>
              <input
                className="form-checkbox"
                type="checkbox"
                id="is_anonymous"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
              />
            </div>
            <div className="loginn">
              <p>
                Already have an account?
                <Link to="/signin" className="link">Sign In</Link>
              </p>
            </div>
              <div className="accept">
              <p>
              By clicking the submit button below, you agree to the GiveStream
              <Link to="/terms" className="link">Terms of Service</Link> and acknowledge the <Link to="/privacy" className="link">Privacy Notice</Link>.
            </p>
              </div>
            <button
              className="login-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDonorForm;
