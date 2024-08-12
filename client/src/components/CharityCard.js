import React from 'react';
import './CharityCard.css';
import defaultProfile from '../assets/defaultProfile.png'
import CharityDetails from './CharityDashbord';
import { Link } from 'react-router-dom';

const CharityCard = ({ charity }) => {
    const progressPercentage = (charity.total_raised / charity.goal_amount) * 100;

    return (
        <div>
            <div className='charity-profile'>
                <img 
                    src={charity.image_url || defaultProfile} 
                    alt={charity.name} 
                    className="charity-logo"
                />
            </div>
            <div className="charity-card">
                <h2>{charity.name}</h2>
                <p className='amount-raised'>RAISED: KES {charity.total_raised}</p>
                <p className='donation-number'>Donations: {charity.donation_count}</p>
                <div className="progress-bar">
                    <div 
                        className="progress" 
                        style={{width: `${progressPercentage}%`}}
                    ></div>
                </div>
                <p className='goal'><span className='money'>KES {charity.total_raised}</span> funds raised of <span className='money'>KES {charity.goal_amount}</span> goal</p>
                <div className='donate-btn'>
                    <button className="button" style={{ backgroundColor: "#00008B", color: "white" }}> <Link to="/charity-dashboard/:id" >Donate</Link></button>
                </div>
            </div>
        </div>
    );
};

export default CharityCard;
