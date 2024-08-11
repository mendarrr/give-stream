import React, { useState } from 'react';
import './CharityApplications.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const CharityApplications = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState(new Set());
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
        country: '',
        city: '',
        zipcode: '',
        title: '',
        target_amount: '',
        image: '',
        summary: ''
    });
    const [selectedCategory, setSelectedCategory] = useState(new Set());
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [errorMessages, setErrorMessages] = useState({});

    const navigate = useNavigate();

    const handleButtonClick = (option) => {
        setSelectedOptions(new Set([option]));
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(category)) {
                newSelection.delete(category);
            } else {
                newSelection.add(category);
            }
            return newSelection;
        });
    };

    const handleDonationClick = (amount) => {
        setSelectedDonation(amount);
        setFormData(prevData => ({
            ...prevData,
            target_amount: '' // Clear the custom amount field
        }));
    };

    const handleNextClick = () => {
        let newErrorMessages = {};

        if (currentStep === 1 && selectedOptions.size === 0) {
            newErrorMessages.step1 = 'Please select an option.';
        } else if (currentStep === 2) {
            const requiredFields = [
                'name',
                'email',
                'description',
                'country',
                'city',
                'zipcode',
                'title'
            ];
            requiredFields.forEach(field => {
                if (!formData[field]) {
                    newErrorMessages[field] = 'Please fill this field.';
                }
            });
            if (selectedCategory.size === 0) {
                newErrorMessages.step2 = 'Please select at least one category.';
            }
        } else if (currentStep === 3 && !formData.target_amount && !selectedDonation) {
            newErrorMessages.target_amount = 'Please set a target amount.';
        } else if (currentStep === 4 && (!formData.image || !formData.summary)) {
            if (!formData.image) newErrorMessages.image = 'Please provide an image URL.';
            if (!formData.summary) newErrorMessages.summary = 'Please provide a summary.';
        }

        if (Object.keys(newErrorMessages).length > 0) {
            setErrorMessages(newErrorMessages);
            return;
        }

        if (currentStep === 1 && selectedOptions.size > 0) {
            setCurrentStep(2);
        } else if (currentStep === 2 && selectedCategory.size > 0) {
            setCurrentStep(3);
        } else if (currentStep === 3 && (selectedDonation || formData.target_amount)) {
            setCurrentStep(4);
        } else if (currentStep === 4 && formData.image && formData.summary) {
            setCurrentStep(6); // Move to the preview step
        } else if (currentStep === 5) {
            handleSubmit(); // Submit form when on the final confirmation step
        }
    };

    const handlePreviousClick = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // If custom target amount input field is changed, clear the predefined donation selection
        if (name === 'target_amount') {
            setSelectedDonation(null);
        }
    };

    const handleSubmit = async () => {
        const requiredFields = [
            'name',
            'email',
            'description',
            'country',
            'city',
            'zipcode',
            'title',
            'target_amount',
            'image',
            'summary'
        ];
    
        const isFormValid = requiredFields.every(field => formData[field] || (field === 'target_amount' && selectedDonation));
    
        if (!isFormValid) {
            setErrorMessages(prev => ({
                ...prev,
                form: 'Please fill out all required fields.'
            }));
            return;
        }
    
        try {
            const response = await fetch('/charity-applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (response.ok) {
                const result = await response.json();
                if (result.emailExists) {
                    setErrorMessages(prev => ({
                        ...prev,
                        submitError: 'Email already exists in the system.'
                    }));
                } else {
                    setCurrentStep(5); // Move to the confirmation step
                }
            } else if (response.status === 409) {
                setErrorMessages(prev => ({
                    ...prev,
                    submitError: 'Email already exists in the system. Please use a different email.'
                }));
            } else {
                setErrorMessages(prev => ({
                    ...prev,
                    submitError: 'There was an error submitting your application. Please try again.'
                }));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessages(prev => ({
                ...prev,
                submitError: 'An unexpected error occurred. Please try again.'
            }));
        }
    };
    
    const handleExit = () => {
        navigate('/'); // Navigate to the main page or any other route
    };

    const handlePreviewSubmit = () => {
        handleSubmit();
    };

    return (
        <div className="charity-applications">
            <Navbar isSticky={true} isLoggedIn={true} />

            {/* First Card */}
            {currentStep === 1 && (
                <div id="card1" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Who Are You Fundraising For?</h3>
                        <div className="button-container">
                            {['Yourself', 'Someone Else', 'Charity'].map(option => (
                                <div key={option} className="button-with-description">
                                    <button 
                                        className={`fundraising-button ${selectedOptions.has(option) ? 'selected' : ''}`}
                                        onClick={() => handleButtonClick(option)}
                                    >
                                        {option}
                                    </button>
                                    <div className="button-description">
                                        {option === 'Yourself' && 'This campaign is for you, and the funds raised will go to your account.'}
                                        {option === 'Someone Else' && "You're running the campaign on their behalf and managing the funds collected."}
                                        {option === 'Charity' && "You’re with a charity or raising funds for it."}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errorMessages.step1 && <div className="error-message">{errorMessages.step1}</div>}
                        <div className="card-footer">
                            <button 
                                className={`next-button ${selectedOptions.size === 0 ? 'disabled' : ''}`}
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
                <div id="card2" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Basic Information</h3>
                        <form>
                            {[
                                { id: 'name', placeholder: 'Name', type: 'text' },
                                { id: 'email', placeholder: 'Email', type: 'email' },
                                { id: 'description', placeholder: 'Description', type: 'text' },
                                { id: 'country', placeholder: 'Country', type: 'text' },
                                { id: 'city', placeholder: 'City/Town', type: 'text' },
                                { id: 'zipcode', placeholder: 'Zip Code', type: 'text' },
                                { id: 'title', placeholder: 'Title', type: 'text' }
                            ].map(({ id, placeholder, type }) => (
                                <div key={id} className="input-group">
                                    <div className="input-wrapper">
                                        <input 
                                            type={type} 
                                            id={id} 
                                            name={id} 
                                            value={formData[id]} 
                                            onChange={handleInputChange} 
                                            placeholder={placeholder} 
                                        />
                                        {errorMessages[id] && <div className="error-message">{errorMessages[id]}</div>}
                                    </div>
                                </div>
                            ))}
                        </form>
                        <h3 className="reason-title">What Best Describes Your Reason for Fundraising?</h3>
                        <div className="category-buttons">
                            {['Medical', 'Education', 'Emergency', 'Welfare', 'Other'].map(category => (
                                <button 
                                    key={category}
                                    className={`fundraising-button ${selectedCategory.has(category) ? 'selected' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                        {errorMessages.step2 && <div className="error-message">{errorMessages.step2}</div>}
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className={`next-button ${selectedCategory.size === 0 ? 'disabled' : ''}`}
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
                <div id="card3" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Set Your Charity's Target Amount</h3>
                        <div className="donation-buttons">
                            {[50000, 100000, 200000, 500000, 1000000].map(amount => (
                                <button 
                                    key={amount}
                                    className={`donation-button ${selectedDonation === amount ? 'selected' : ''}`}
                                    onClick={() => handleDonationClick(amount)}
                                >
                                    {amount}
                                </button>
                            ))}
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    type="number" 
                                    id="target_amount" 
                                    name="target_amount" 
                                    value={formData.target_amount} 
                                    onChange={handleInputChange} 
                                    placeholder="Or enter a custom target" 
                                />
                                {errorMessages.target_amount && <div className="error-message">{errorMessages.target_amount}</div>}
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className={`next-button ${formData.target_amount || selectedDonation ? '' : 'disabled'}`}
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
                <div id="card4" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Charity Profile Photo URL and Summary</h3>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="Image URL"
                                />
                                {errorMessages.image && <div className="error-message">{errorMessages.image}</div>}
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <textarea
                                    id="summary"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    placeholder="Summary of your application"
                                />
                                {errorMessages.summary && <div className="error-message">{errorMessages.summary}</div>}
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className={`next-button ${!formData.image || !formData.summary ? 'disabled' : ''}`}
                                onClick={handleNextClick}
                                disabled={!formData.image || !formData.summary}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Card */}
            {currentStep === 6 && (
                <div id="preview-card" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Review the Details you Provided</h3>
                        <div className="preview-details">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                            <p><strong>Country:</strong> {formData.country}</p>
                            <p><strong>City:</strong> {formData.city}</p>
                            <p><strong>Zip Code:</strong> {formData.zipcode}</p>
                            <p><strong>Title:</strong> {formData.title}</p>
                            <p><strong>Target Amount:</strong> {formData.target_amount || selectedDonation}</p>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={() => setCurrentStep(4)}>Previous</button>
                            <button className="submit-button" onClick={handlePreviewSubmit}>Submit</button>
                            {/* Unique Error Message Container for Submit Button */}
                            {errorMessages.submitError && <div className="submit-error-message">{errorMessages.submitError}</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Card */}
            {currentStep === 5 && (
                <div id="confirmation-card" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Thank You!</h3>
                        <p>Your application has been submitted successfully. We will get back to you soon.</p>
                        <button className="exit-button" onClick={handleExit}>Exit Page</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharityApplications;
