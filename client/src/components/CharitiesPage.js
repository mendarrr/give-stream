import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CharitiesPage.css";

const CharitiesPage = () => {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/charities")
      .then((response) => response.json())
      .then((data) => setCharities(data))
      .catch((error) => console.error("Error fetching charities:", error));
  }, []);

  const formatCurrency = (amount) => {
    return typeof amount === "number" ? amount.toLocaleString() : "0";
  };

  const calculateProgress = (raised, goal) => {
    if (typeof raised === "number" && typeof goal === "number" && goal > 0) {
      return Math.min((raised / goal) * 100, 100);
    }
    return 0;
  };

  return (
    <div className="charity-list-container">
      <h1>Charities</h1>
      <div className="charity-grid">
        {charities.map((charity) => (
          <Link
            to={`/charity-dashboard/${charity.id}`}
            key={charity.id}
            className="charity-card"
          >
            <img
              src={charity.image_url || "https://via.placeholder.com/150"}
              alt={charity.name}
              className="charity-image"
            />
            <h2>{charity.name || "Unnamed Charity"}</h2>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${calculateProgress(
                    charity.total_raised,
                    charity.needed_donation
                  )}%`,
                }}
              ></div>
            </div>
            <p className="funds-info">
              <span className="raised-amount">
                KES {formatCurrency(charity.total_raised)}
              </span>{" "}
              raised of
              <span className="goal-amount">
                {" "}
                KES {formatCurrency(charity.needed_donation)}
              </span>{" "}
              goal
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CharitiesPage;
