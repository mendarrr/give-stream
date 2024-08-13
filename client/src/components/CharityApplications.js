import React, { useState } from "react";
import "./CharityApplications.css";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";

const CharityApplications = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(new Set());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    country: "",
    city: "",
    zipcode: "",
    username: "",
    target_amount: "",
    image: "",
    summary: "",
    password: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(new Set());
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  const navigate = useNavigate();

  const handleButtonClick = (option) => {
    setSelectedOptions(new Set([option]));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => {
      const newSelection = new Set(prev);
      newSelection.has(category)
        ? newSelection.delete(category)
        : newSelection.add(category);
      return newSelection;
    });
  };

  const handleDonationClick = (amount) => {
    setSelectedDonation(amount);
    setFormData((prevData) => ({ ...prevData, target_amount: amount }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErrorMessages((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrorMessages((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setErrorMessages((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters long.",
      }));
    } else {
      setErrorMessages((prev) => {
        const { password, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleEmailBlur = () => {
    validateEmail(formData.email);
  };

  const handlePasswordBlur = () => {
    validatePassword(formData.password);
  };

  const handleNextClick = () => {
    let newErrorMessages = {};

    if (currentStep === 1 && selectedOptions.size === 0) {
      newErrorMessages.step1 = "Please select an option.";
    } else if (currentStep === 2) {
      const requiredFields = [
        "name",
        "email",
        "description",
        "country",
        "city",
        "zipcode",
        "username",
      ];
      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrorMessages[field] = "Please fill this field.";
        }
      });
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrorMessages.email = "Please enter a valid email address.";
      }
      if (selectedCategory.size === 0) {
        newErrorMessages.step2 = "Please select at least one category.";
      }
    } else if (
      currentStep === 3 &&
      !formData.target_amount &&
      !selectedDonation
    ) {
      newErrorMessages.target_amount = "Please set a target amount.";
    } else if (currentStep === 4) {
      if (!formData.image)
        newErrorMessages.image = "Please provide an image URL.";
      if (!formData.summary)
        newErrorMessages.summary = "Please provide a summary.";
    }

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    switch (currentStep) {
      case 1:
        if (selectedOptions.size > 0) setCurrentStep(2);
        break;
      case 2:
        if (selectedCategory.size > 0) setCurrentStep(3);
        break;
      case 3:
        if (selectedDonation || formData.target_amount) setCurrentStep(4);
        break;
      case 4:
        if (formData.image && formData.summary) setCurrentStep(6);
        break;
      case 5:
        handleSubmit();
        break;
      default:
        break;
    }
  };

  const handlePreviousClick = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "name",
      "email",
      "description",
      "country",
      "city",
      "zipcode",
      "username",
      "target_amount",
      "image",
      "summary",
      "password",
    ];
    const isFormValid = requiredFields.every(
      (field) =>
        formData[field] || (field === "target_amount" && selectedDonation)
    );

    if (!isFormValid) {
      setErrorMessages((prev) => ({
        ...prev,
        form: "Please fill out all required fields.",
      }));
      return;
    }

    try {
      const response = await fetch("/charity-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.emailExists) {
          setErrorMessages((prev) => ({
            ...prev,
            submitError: "Email already exists in the system.",
          }));
        } else {
          setCurrentStep(5);
        }
      } else {
        const error =
          response.status === 409
            ? "Email already exists in the system. Please use a different email."
            : "There was an error submitting your application. Please try again.";
        setErrorMessages((prev) => ({ ...prev, submitError: error }));
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessages((prev) => ({
        ...prev,
        submitError: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  const handleExit = () => {
    navigate("/"); // Navigate to the main page or any other route
  };

  const handlePreviewSubmit = () => {
    handleSubmit();
  };

  return (
    <div className="charity-applications">
      <div>
        <Navbar isSticky={true} isLoggedIn={true} />
      </div>
      {/* First Card */}
      {currentStep === 1 && (
        <div id="card1" className="card card1">
          <div className="form-left">
            <img
              src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
              alt="GiveStream Logo"
              className="logo"
            />
          </div>
          <div className="form-right card-content">
            <h3>Who Are You Fundraising For?</h3>
            <div className="button-container">
              {["Yourself", "Someone Else", "Charity"].map((option) => (
                <div key={option} className="button-with-description">
                  <button
                    className={`fundraising-button ${
                      selectedOptions.has(option) ? "selected" : ""
                    }`}
                    onClick={() => handleButtonClick(option)}
                  >
                    {option}
                  </button>
                  <div className="button-description">
                    {option === "Yourself" &&
                      "This campaign is for you, and the funds raised will go to your account."}
                    {option === "Someone Else" &&
                      "You're running the campaign on their behalf and managing the funds collected."}
                    {option === "Charity" &&
                      "You’re with a charity or raising funds for it."}
                  </div>
                </div>
              ))}
            </div>
            {errorMessages.step1 && (
              <div className="error-message">{errorMessages.step1}</div>
            )}
            <div className="card-footer">
              <button
                className={`next-button ${
                  selectedOptions.size === 0 ? "disabled" : ""
                }`}
                onClick={handleNextClick}
                disabled={selectedOptions.size === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Second Card */}
      {currentStep === 2 && (
        <div id="card2" className="card card2">
          <div className="form-left">
            <img
              src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
              alt="GiveStream Logo"
              className="logo"
            />
          </div>
          <div className="form-right card-content">
            <h3>Basic Information</h3>
            <form className="form2-container card2-form">
              {[
                { id: "name", placeholder: "Name", type: "text" },
                { id: "email", placeholder: "Email", type: "email" },
                { id: "description", placeholder: "Description", type: "text" },
                { id: "country", placeholder: "Country", type: "text" },
                { id: "city", placeholder: "City/Town", type: "text" },
                { id: "zipcode", placeholder: "Zip Code", type: "text" },
                { id: "username", placeholder: "Username", type: "text" },
                { id: "password", placeholder: "Password", type: "password" },
              ].map(({ id, placeholder, type }) => (
                <div key={id} className="input-group form-group">
                  <div className="input-wrapper">
                    <input
                      type={type}
                      id={id}
                      name={id}
                      value={formData[id]}
                      onChange={handleInputChange}
                      onBlur={
                        id === "email"
                          ? handleEmailBlur
                          : id === "password"
                          ? handlePasswordBlur
                          : undefined
                      }
                      placeholder={placeholder}
                    />
                    {errorMessages[id] && (
                      <div className="error-message">{errorMessages[id]}</div>
                    )}
                  </div>
                </div>
              ))}
            </form>
            <h3 className="reason-title">
              What Best Describes Your Reason for Fundraising?
            </h3>
            <div className="category-buttons">
              {["Medical", "Education", "Emergency", "Welfare", "Other"].map(
                (category) => (
                  <button
                    key={category}
                    className={`select-fundraising ${
                      selectedCategory.has(category) ? "selected" : ""
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </button>
                )
              )}
            </div>
            {errorMessages.step2 && (
              <div className="error-message">{errorMessages.step2}</div>
            )}
            <div className="card2-footer">
              <button className="previous-button" onClick={handlePreviousClick}>
                Previous
              </button>
              <button
                className={`next-button ${
                  selectedCategory.size === 0 ? "disabled" : ""
                }`}
                onClick={handleNextClick}
                disabled={selectedCategory.size === 0}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Third Card */}
      {currentStep === 3 && (
        <div id="card3" className="card card3">
          <div className="form-left">
            <img
              src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
              alt="GiveStream Logo"
              className="logo"
            />
          </div>
          <div className="form-right card3-content">
            <h3>Set Your Charity's Target Amount</h3>
            <div className="donation-buttons">
              {[
                50000, 100000, 200000, 500000, 1000000, 150000, 200000, 250000,
              ].map((amount) => (
                <button
                  key={amount}
                  className={`select-donation ${
                    selectedDonation === amount ? "selected" : ""
                  }`}
                  onClick={() => handleDonationClick(amount)}
                >
                  {amount}
                </button>
              ))}
            </div>
            <div className="input-group">
              <div className="input-wrapper card3-form-group">
                <input
                  // type="number"
                  id="target_amount"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  placeholder="Custom Target Amount"
                />
                {errorMessages.target_amount && (
                  <div className="error-message">
                    {errorMessages.target_amount}
                  </div>
                )}
              </div>
            </div>
            <div className="card3-footer">
              <button className="previous-button" onClick={handlePreviousClick}>
                Previous
              </button>
              <button
                className={`next-button ${
                  formData.target_amount || selectedDonation ? "" : "disabled"
                }`}
                onClick={handleNextClick}
                disabled={!formData.target_amount && !selectedDonation}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fourth Card */}
      {currentStep === 4 && (
        <div id="card4" className="card4">
          <div className="form-page">
            <div className="form-left">
              <img
                src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
                alt="GiveStream Logo"
                className="logo"
              />
            </div>
            <div className="form-right">
              <div className="form-container">
                <div className="form-text">
                  <h3>Upload an Image and Write a Brief Summary</h3>
                </div>
                <div className="form-group">
                  <input
                    className="input-group"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Image URL"
                  />
                  {errorMessages.image && (
                    <div className="error-message">{errorMessages.image}</div>
                  )}
                </div>
                <div className="textarea">
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="Write a brief summary"
                  />
                  {errorMessages.summary && (
                    <div className="error-message">{errorMessages.summary}</div>
                  )}
                </div>
              </div>
              <div className="card4-footer">
                <button
                  className="previous-button"
                  onClick={handlePreviousClick}
                  disabled={currentStep === 1}
                >
                  Previous
                </button>
                <button
                  className="next-button"
                  onClick={handleNextClick}
                  disabled={!formData.image || !formData.summary}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Card */}
      {currentStep === 6 && (
        <div id="preview-card" className="card card5">
          <div className="form-right card-content">
            <h3 className="review">Review the Details you Provided</h3>
            <div className="preview-details">
              <p>
                <strong>Name:</strong> {formData.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Description:</strong> {formData.description}
              </p>
              <p>
                <strong>Country:</strong> {formData.country}
              </p>
              <p>
                <strong>City:</strong> {formData.city}
              </p>
              <p>
                <strong>Zip Code:</strong> {formData.zipcode}
              </p>
              <p>
                <strong>User name:</strong> {formData.username}
              </p>
              <p>
                <strong>Target Amount:</strong> {formData.target_amount}
              </p>
            </div>
            <div className="card5-footer">
              <button
                className="previous-button"
                onClick={() => setCurrentStep(4)}
              >
                Previous
              </button>
              <button
                className="next-button submit"
                onClick={handlePreviewSubmit}
              >
                Submit
              </button>
              {errorMessages.submitError && (
                <div className="submit-error-message">
                  {errorMessages.submitError}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Card */}
      {currentStep === 5 && (
        <div id="confirmation-card" className="card">
          <div className="form-right card6-content">
            <div className="form-text">
              <h3 className="success-donation">
                Donation Campaign Application was Successful!
              </h3>
              <p className="congratulations">
                Congratulations! Your fundraising initiative is now live and
                awaiting approval in readiness for donations by GiveStream
                Donors. Once approved, use the username and password you
                provided to sign in to your account so that you can track your
                progress and manage your data from your dashboard. If you have
                any questions or need assistance, our support team is here to
                help.
              </p>
              <p className="thanks">
                Thank you for choosing our platform, and best of luck with your
                fundraiser!
              </p>
              <div className="ext">
              <Link to="/" className="exit-button next-button">
                Back to HomePage
              </Link>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityApplications;
