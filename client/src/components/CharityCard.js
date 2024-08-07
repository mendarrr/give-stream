import React from "react";
import { useNavigate } from "react-router-dom";
import "./CharityCard.css";

function CharityCard({ charity }) {
  const navigate = useNavigate();

  const {
    id,
    name = "No Name",
    description = "No Description",
    imageUrl = "",
    raisedAmount = 0,
    goalAmount = 0,
    donationCount = 0,
  } = charity || {};

  const progressPercentage =
    goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0;

  const handleSelectCharity = () => {
    navigate(`/charity/${id}`);
  };

  return (
    <div className="charity-card">
      <img className="charity-card-image" src={imageUrl} alt={name} />
      <div className="charity-card-content">
        <h2 className="charity-card-title">{name}</h2>
        <p className="charity-card-description">{description}</p>
        <div className="charity-card-progress">
          <div
            className="charity-card-progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="charity-card-stats">
          <span className="charity-card-amount">
            KES {raisedAmount.toLocaleString()}
          </span>
          <span className="charity-card-goal">
            raised of KES {goalAmount.toLocaleString()} goal
          </span>
        </div>
        <div className="charity-card-donations">
          {donationCount.toLocaleString()} donations
        </div>
        <button className="charity-card-button" onClick={handleSelectCharity}>
          Select Charity
        </button>
      </div>
    </div>
  );
}

export default CharityCard;
