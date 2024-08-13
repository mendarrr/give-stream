import React, { useState } from "react";
import "./Form.css";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

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
      <div className="navv">
        <Navbar isSticky={true} isLoggedIn={true} />
      </div>
      {/* First Card */}
      {currentStep === 1 && (
        <div className="card1 responsive-card">
          <div className="form-page">
            <div className="form-left">
              <img
                src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
                alt="GiveStream Logo"
                className="logo"
              />
            </div>
            <div className="form-right">
              <div className="card1-container">
                <div className="card1-text">
                  <h3>Who Are You Fundraising For?</h3>
                </div>
                <div className="button-container responsive-container">
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
        </div>
      )}

      {/* Second Card */}
      {currentStep === 2 && (
        <div className="card2">
          <div className="form-page card2-form-page">
            <div className="form-left">
              <img
                src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
                alt="GiveStream Logo"
                className="logo"
              />
            </div>
            <div className="form-right">
              <div className="card2-container">
                <form className="form-container">
                  <div className="form-text">
                    <h3>Basic Information</h3>
                  </div>
                  {[
                    { id: "name", placeholder: "Name" },
                    { id: "email", placeholder: "Email" },
                    { id: "description", placeholder: "Description" },
                    { id: "country", placeholder: "Country" },
                    { id: "city", placeholder: "City/Town" },
                    { id: "zipcode", placeholder: "Zip Code" },
                    { id: "username", placeholder: "Username" },
                  ].map(({ id, placeholder, type }) => (
                    <div key={id} className="input-group">
                      <div className="input-wrapper form-group">
                        <input
                          type={type}
                          id={id}
                          name={id}
                          value={formData[id]}
                          onChange={handleInputChange}
                          placeholder={placeholder}
                          className="form-input"
                          required
                        />
                      </div>
                      {errorMessages[id] && (
                        <div className="error-message">{errorMessages[id]}</div>
                      )}
                    </div>
                  ))}
                </form>
                <div className="reason">
                  <h3>What Best Describes Your Reason for Fundraising?</h3>
                  <div className="category-buttons">
                    {[
                      "Medical",
                      "Education",
                      "Emergency",
                      "Welfare",
                      "Other",
                    ].map((category) => (
                      <button
                        key={category}
                        className={`select-fundraising ${
                          selectedCategory.has(category) ? "selected" : ""
                        }`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                {errorMessages.step2 && (
                  <div className="error-message">{errorMessages.step2}</div>
                )}
              </div>
              <div className="card2-footer">
                <button
                  className="previous-button"
                  onClick={handlePreviousClick}
                  disabled={currentStep === 1}
                >
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
        </div>
      )}

      {/* Third Card */}
      {currentStep === 3 && (
        <div className="card3">
          <div className="form-page">
            <div className="form-left">
              <img
                src="./Screenshot_from_2024-08-06_07-21-51-removebg-preview.png"
                alt="GiveStream Logo"
                className="logo"
              />
            </div>
            <div className="form-right">
              <div classname="form-text">
                <h3 className="card3-h3">Set a target For Your Donation Campaign</h3>
              </div>
              <div className="card-content form-container">
                <div classname="form-text">
                  <h4 className="card3-h4">Set a target For Your Donation Campaign</h4>
                  <p className="card3-p">Donations to benfit GiveStream</p>
                </div>
                <div className="donation-options">
                  <h4>Enter a Donation Target</h4>
                  {[
                    "KES 5,000",
                    "KES 10,000",
                    "KES 25,000",
                    "KES 50,000",
                    "KES 75,000",
                    "KES 100,000",
                    "KES 150,000",
                    "KES 200,000",
                    "Other",
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
                {selectedDonation === "Other" && (
                  <div className="card3-form-group">
                    <input
                      className="card3-form-input"
                      id="target_amount"
                      name="target_amount"
                      value={formData.target_amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                    />
                    {errorMessages.target_amount && (
                      <div className="error-message">
                        {errorMessages.target_amount}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="card3-footer">
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
                  disabled={
                    !selectedDonation && formData.target_amount.trim() === ""
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fourth Card */}
      {currentStep === 4 && (
        <div id="card4" className="card">
          <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
          <div className="card-content">
            <h3>Upload an Image and Write a Brief Summary</h3>
            <div className="input-group">
              <label htmlFor="image" className="upload-label">
                Upload Image
              </label>
              <input
                type="text"
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
            <div className="input-group">
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
          <div className="card-footer">
            <button
              className="prev-button"
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
      )}

      {/* Fifth Card */}
      {currentStep === 5 && (
        <div id="card5" className="card">
          <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
          <div className="card-content">
            <h3>Preview and Submit Your Application</h3>
            <div className="preview-section">
              <h4>Fundraising for:</h4>
              <p>{Array.from(selectedOptions).join(", ")}</p>
              <h4>Basic Information:</h4>
              <p>
                Name: {formData.name}
                <br />
                Email: {formData.email}
                <br />
                Description: {formData.description}
                <br />
                Country: {formData.country}
                <br />
                City/Town: {formData.city}
                <br />
                Zip Code: {formData.zipcode}
                <br />
                Username: {formData.username}
              </p>
              <h4>Categories:</h4>
              <p>{Array.from(selectedCategory).join(", ")}</p>
              <h4>Target Amount:</h4>
              <p>{formData.target_amount}</p>
              <h4>Summary:</h4>
              <p>{formData.summary}</p>
              <h4>Image:</h4>
              <img
                src={formData.image}
                alt="Uploaded"
                className="preview-image"
              />
            </div>
            {errorMessages.submitError && (
              <div className="error-message">{errorMessages.submitError}</div>
            )}
          </div>
          <div className="card-footer">
            <button
              className="prev-button"
              onClick={handlePreviousClick}
              disabled={currentStep === 1}
            >
              Previous
            </button>
            <button className="submit-button" onClick={handlePreviewSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Sixth Card */}
      {currentStep === 6 && (
        <div id="card6" className="card">
          <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
          <div className="card-content">
            <h3>Application Submitted!</h3>
            <p>
              Thank you for submitting your application. Our team will review it
              and get back to you soon.
            </p>
          </div>
          <div className="card-footer">
            <button className="exit-button" onClick={handleExit}>
              Exit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharityApplications;
