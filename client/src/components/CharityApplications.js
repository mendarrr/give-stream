import React, { useState } from 'react';
import './CharityApplications.css';
import Navbar from './Navbar'; // Ensure this path is correct

const CharityApplications = () => {
    const [currentStep, setCurrentStep] = useState(1); // Track the current card step
    const [selectedOptions, setSelectedOptions] = useState(new Set());
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        description: '',
        country: '',
        city: '',
        zipCode: '',
        title: '',
        donationTarget: '' // Updated to reflect new field
    });
    const [selectedCategory, setSelectedCategory] = useState(new Set());
    const [selectedDonations, setSelectedDonations] = useState(new Set()); // Track selected donation amounts

    // Handle selection for buttons in Card 1
    const handleButtonClick = (option) => {
        setSelectedOptions(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(option)) {
                newSelection.delete(option); // Deselect if already selected
            } else {
                newSelection.add(option); // Select if not already selected
            }
            return newSelection;
        });
    };

    // Handle selection for buttons in Card 2
    const handleCategoryClick = (category) => {
        setSelectedCategory(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(category)) {
                newSelection.delete(category); // Deselect if already selected
            } else {
                newSelection.add(category); // Select if not already selected
            }
            return newSelection;
        });
    };

    // Handle donation amount selection on Card 3
    const handleDonationClick = (amount) => {
        setSelectedDonations(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(amount)) {
                newSelection.delete(amount); // Deselect if already selected
            } else {
                newSelection.add(amount); // Select if not already selected
            }
            return newSelection;
        });
    };

    const handleNextClick = () => {
        if (currentStep === 1 && selectedOptions.size > 0) {
            setCurrentStep(2); // Move to Card 2
        } else if (currentStep === 2 && selectedCategory.size > 0) {
            setCurrentStep(3); // Move to Card 3
        } else if (currentStep === 3 && (selectedDonations.size > 0 || formData.donationTarget)) {
            setCurrentStep(4); // Move to Card 4
        } else {
            alert("Please make a selection before proceeding.");
        }
    };

    const handlePreviousClick = () => {
        if (currentStep === 2) {
            setCurrentStep(1); // Move back to Card 1
        } else if (currentStep === 3) {
            setCurrentStep(2); // Move back to Card 2
        } else if (currentStep === 4) {
            setCurrentStep(3); // Move back to Card 3
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="charity-applications">
            <Navbar isSticky={true} isLoggedIn={true} /> {/* Adjust props as needed */}
            
            {/* First Card */}
            {currentStep === 1 && (
                <div id="card1" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Who Are You Fundraising For?</h3>
                        <div className="button-container">
                            <div className="button-with-description">
                                <button 
                                    className={`fundraising-button ${selectedOptions.has('Yourself') ? 'selected' : ''}`}
                                    onClick={() => handleButtonClick('Yourself')}
                                >
                                    Yourself
                                </button>
                                <div className="button-description">
                                    This campaign is for you, and the funds raised will go to your account.
                                </div>
                            </div>
                            <hr />
                            <div className="button-with-description">
                                <button 
                                    className={`fundraising-button ${selectedOptions.has('Someone Else') ? 'selected' : ''}`}
                                    onClick={() => handleButtonClick('Someone Else')}
                                >
                                    Someone Else
                                </button>
                                <div className="button-description">
                                    You're running the campaign on their behalf and managing the funds collected.
                                </div>
                            </div>
                            <hr />
                            <div className="button-with-description">
                                <button 
                                    className={`fundraising-button ${selectedOptions.has('Charity') ? 'selected' : ''}`}
                                    onClick={() => handleButtonClick('Charity')}
                                >
                                    Charity
                                </button>
                                <div className="button-description">
                                    You’re with a charity or raising funds for it.
                                </div>
                            </div>
                        </div>
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
                        <h3>Provide the Following Details</h3>
                        <form>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        placeholder="Name" 
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        placeholder="Email" 
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="description" 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleInputChange} 
                                        placeholder="Description" 
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="country" 
                                        name="country" 
                                        value={formData.country} 
                                        onChange={handleInputChange} 
                                        placeholder="Country" 
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="city" 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleInputChange} 
                                        placeholder="City/Town" 
                                    />
                                </div>
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="zipCode" 
                                        name="zipCode" 
                                        value={formData.zipCode} 
                                        onChange={handleInputChange} 
                                        placeholder="Zip Code" 
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input 
                                        type="text" 
                                        id="title" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleInputChange} 
                                        placeholder="Title" 
                                    />
                                </div>
                            </div>
                        </form>
                        <h3 className="reason-title">What Best Describes Your Reason for Fundraising?</h3>
                        <div className="category-buttons">
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Medical') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Medical')}
                            >
                                Medical
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Education') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Education')}
                            >
                                Education
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Environment') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Environment')}
                            >
                                Environment
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Community') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Community')}
                            >
                                Community
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Animal Welfare') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Animal Welfare')}
                            >
                                Animal Welfare
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Arts') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Arts')}
                            >
                                Arts
                            </button>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>
                                Previous
                            </button>
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
                        <h3>What Amount Are You Trying to Raise?</h3>
                        <div className="donation-buttons">
                            <button 
                                className={`donation-button ${selectedDonations.has('5000') ? 'selected' : ''}`}
                                onClick={() => handleDonationClick('5000')}
                            >
                                5000
                            </button>
                            <button 
                                className={`donation-button ${selectedDonations.has('10000') ? 'selected' : ''}`}
                                onClick={() => handleDonationClick('10000')}
                            >
                                10000
                            </button>
                            <button 
                                className={`donation-button ${selectedDonations.has('20000') ? 'selected' : ''}`}
                                onClick={() => handleDonationClick('20000')}
                            >
                                20000
                            </button>
                            <button 
                                className={`donation-button ${selectedDonations.has('50000') ? 'selected' : ''}`}
                                onClick={() => handleDonationClick('50000')}
                            >
                                50000
                            </button>
                        </div>
                        <div className="custom-donation">
                            <input
                                type="number"
                                name="donationTarget"
                                value={formData.donationTarget}
                                onChange={handleInputChange}
                                placeholder="Custom Amount"
                            />
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>
                                Previous
                            </button>
                            <button 
                                className={`next-button ${(selectedDonations.size > 0 || formData.donationTarget) ? '' : 'disabled'}`}
                                onClick={handleNextClick}
                                disabled={selectedDonations.size === 0 && !formData.donationTarget}
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
                        <h3>Summary</h3>
                        <p>Name: {formData.name}</p>
                        <p>Email: {formData.email}</p>
                        <p>Description: {formData.description}</p>
                        <p>Country: {formData.country}</p>
                        <p>City/Town: {formData.city}</p>
                        <p>Zip Code: {formData.zipCode}</p>
                        <p>Title: {formData.title}</p>
                        <p>Reason: {Array.from(selectedCategory).join(', ')}</p>
                        <p>Donation Target: {Array.from(selectedDonations).join(', ') || formData.donationTarget}</p>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>
                                Previous
                            </button>
                            <button className="submit-button">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharityApplications;
