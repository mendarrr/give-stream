import React from 'react';
import './CharityCard.css';

const CharityCard = ({ charity }) => {
    return (
        <div>
            <div className='charity-profile'></div>
            <div className="charity-card">
                <h2>{charity.name}</h2>
                <p className='amount-raised'>RAISED: KES {charity.total_raised}</p>
                <p className='donation-number'>Donations: {charity.donation_count}</p>
                <div className="progress-bar">
                    <div 
                        className="progress" 
                        style={{width: `${charity.percentage_raised}%`}}
                    ></div>
                </div>
                <p className='goal'><span className='money'>KES {charity.total_raised}</span> funds raised of <span className='money'>KES {charity.needed_donation}</span> goal</p>
                <div className='donate-btn'>
                    <button>Donate</button>
                </div>
            </div>
        </div>
    );
};

export default CharityCard;
