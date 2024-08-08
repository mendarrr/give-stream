import React, { useState, useEffect } from 'react';
import './CharityApplications.css';
import Navbar from './Navbar'; // Ensure this path is correct

const CharityApplications = () => {
    const [applications, setApplications] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState(new Set());

    useEffect(() => {
        fetch('/api/charity-applications')
            .then(response => response.json())
            .then(data => setApplications(data))
            .catch(error => console.error('Error fetching applications:', error));
    }, []);

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

    const handleNextClick = () => {
        if (selectedOptions.size > 0) {
            // Handle the next step here
            console.log('Selected options:', Array.from(selectedOptions));
        }
    };

    return (
        <div className="charity-applications">
            <Navbar isSticky={true} isLoggedIn={true} /> {/* Adjust props as needed */}
            <div className="card">
                <img src="/GiveStreamLogo.png" alt="Logo" className="card-logo" />
                <div className="card-content">
                    <div className="adjacent-card">
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
            </div>
            <ul>
                {applications.map(app => (
                    <li key={app.id} className="application-item">
                        <h2>{app.name}</h2>
                        <p>{app.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharityApplications;
