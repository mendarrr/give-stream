import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CharitiesPage.css";

const CharityCard = ({ charity, onClick }) => {
  const { name, imageUrl, totalRaised, goalAmount } = charity;
  const percentageRaised =
    goalAmount > 0 ? (totalRaised / goalAmount) * 100 : 0;

  return (
    <div className="charity-card" onClick={onClick}>
      <div className="charity-image-container">
        <img
          src={imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
          alt={name}
          className="charity-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/300x200?text=Image+Not+Found";
          }}
        />
      </div>
      <div className="charity-info">
        <h3 className="charity-name">{name || "Unnamed Charity"}</h3>
        <div className="donation-bar-container">
          <div
            className="donation-bar"
            style={{ width: `${percentageRaised}%` }}
          ></div>
        </div>
        <p className="funds-raised">
          ${totalRaised?.toLocaleString() || "0"} raised of $
          {goalAmount?.toLocaleString() || "0"} goal
        </p>
      </div>
    </div>
  );
};

const CharitiesPage = () => {
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/charities")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array of charities");
        }
        setCharities(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching charities:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleCharityClick = (charityId) => {
    navigate(`/charity-dashboard/${charityId}`);
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="charities-page">
      <h1>Charities</h1>
      {isLoading ? (
        <div className="loading-spinner">Loading charities...</div>
      ) : charities.length === 0 ? (
        <p className="no-charities">No charities found.</p>
      ) : (
        <div className="charities-grid">
          {charities.map((charity) => (
            <CharityCard
              key={charity.id}
              charity={charity}
              onClick={() => handleCharityClick(charity.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharitiesPage;
