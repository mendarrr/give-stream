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
        donationTarget: '', // Updated to reflect new field
        imageUrl: '', // New field for image URL
        summary: '' // New field for summary
    });
    const [selectedCategory, setSelectedCategory] = useState(new Set());
    const [selectedDonation, setSelectedDonation] = useState(null); // Track single selected donation amount

    // Handle selection for buttons in Card 1
    const handleButtonClick = (option) => {
        setSelectedOptions(new Set([option])); // Only one option allowed
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
        setSelectedDonation(amount); // Only one donation amount allowed
    };

    const handleNextClick = () => {
        if (currentStep === 1 && selectedOptions.size > 0) {
            setCurrentStep(2); // Move to Card 2
        } else if (currentStep === 2 && selectedCategory.size > 0) {
            setCurrentStep(3); // Move to Card 3
        } else if (currentStep === 3 && (selectedDonation || formData.donationTarget)) {
            setCurrentStep(4); // Move to Card 4
        } else if (currentStep === 4 && formData.imageUrl) {
            setCurrentStep(5); // Move to Card 5
        }
    };

    const handlePreviousClick = () => {
        if (currentStep === 2) {
            setCurrentStep(1); // Move back to Card 1
        } else if (currentStep === 3) {
            setCurrentStep(2); // Move back to Card 2
        } else if (currentStep === 4) {
            setCurrentStep(3); // Move back to Card 3
        } else if (currentStep === 5) {
            setCurrentStep(4); // Move back to Card 4
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
                                className={`fundraising-button ${selectedCategory.has('Animal Welfare') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Animal Welfare')}
                            >
                                Animal Welfare
                            </button>
                            <button 
                                className={`fundraising-button ${selectedCategory.has('Other') ? 'selected' : ''}`}
                                onClick={() => handleCategoryClick('Other')}
                            >
                                Other
                            </button>
                        </div>
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
                        <h3>Set Your Donation Target and Amount</h3>
                        <div className="donation-buttons">
                            <button 
                                className={`donation-button ${selectedDonation === 50 ? 'selected' : ''}`}
                                onClick={() => handleDonationClick(50)}
                            >
                                $50
                            </button>
                            <button 
                                className={`donation-button ${selectedDonation === 100 ? 'selected' : ''}`}
                                onClick={() => handleDonationClick(100)}
                            >
                                $100
                            </button>
                            <button 
                                className={`donation-button ${selectedDonation === 200 ? 'selected' : ''}`}
                                onClick={() => handleDonationClick(200)}
                            >
                                $200
                            </button>
                            <button 
                                className={`donation-button ${selectedDonation === 500 ? 'selected' : ''}`}
                                onClick={() => handleDonationClick(500)}
                            >
                                $500
                            </button>
                            <button 
                                className={`donation-button ${selectedDonation === 1000 ? 'selected' : ''}`}
                                onClick={() => handleDonationClick(1000)}
                            >
                                $1000
                            </button>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="donationTarget" 
                                    name="donationTarget" 
                                    value={formData.donationTarget} 
                                    onChange={handleInputChange} 
                                    placeholder="Or enter a custom amount" 
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className={`next-button ${!selectedDonation && !formData.donationTarget ? 'disabled' : ''}`}
                                onClick={handleNextClick}
                                disabled={!selectedDonation && !formData.donationTarget}
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
                        <h3>Provide Additional Details</h3>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input 
                                    type="text" 
                                    id="imageUrl" 
                                    name="imageUrl" 
                                    value={formData.imageUrl} 
                                    onChange={handleInputChange} 
                                    placeholder="Image URL" 
                                />
                            </div>
                            <div className="input-wrapper">
                                <textarea 
                                    id="summary" 
                                    name="summary" 
                                    value={formData.summary} 
                                    onChange={handleInputChange} 
                                    placeholder="Summary" 
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className={`next-button ${!formData.imageUrl ? 'disabled' : ''}`}
                                onClick={handleNextClick}
                                disabled={!formData.imageUrl}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Final Card */}
            {currentStep === 5 && (
                <div id="card5" className="card">
                    <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                    <div className="card-content">
                        <h3>Review and Submit</h3>
                        <div className="summary">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Description:</strong> {formData.description}</p>
                            <p><strong>Country:</strong> {formData.country}</p>
                            <p><strong>City:</strong> {formData.city}</p>
                            <p><strong>Zip Code:</strong> {formData.zipCode}</p>
                            <p><strong>Title:</strong> {formData.title}</p>
                            <p><strong>Donation Target:</strong> {formData.donationTarget}</p>
                            <p><strong>Selected Donation:</strong> ${selectedDonation}</p>
                            <p><strong>Image URL:</strong> {formData.imageUrl}</p>
                            <p><strong>Summary:</strong> {formData.summary}</p>
                        </div>
                        <div className="card-footer">
                            <button className="previous-button" onClick={handlePreviousClick}>Previous</button>
                            <button 
                                className="submit-button"
                                onClick={() => console.log('Form data:', formData, 'Selected Donation:', selectedDonation)}
                            >
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
