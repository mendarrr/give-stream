import React from 'react';
import './CharityCard.css';

const CharityCard = ({ charity }) => {
    return (
        <div className="charity-card">
            <h2>{charity.name}</h2>
            <p>Amount Raised: ${charity.total_raised}</p>
            <p>Number of Donations: {charity.donation_count}</p>
            <div className="progress-bar">
                <div 
                    className="progress" 
                    style={{width: `${charity.percentage_raised}%`}}
                ></div>
            </div>
            <p>Goal: ${charity.total_raised} / ${charity.needed_donation}</p>
        </div>
    );
};

export default CharityCard;
