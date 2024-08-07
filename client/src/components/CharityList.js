import React, { useState, useEffect } from "react";
import CharityCard from "./CharityCard";
import "./CharityList.css";

function CharityList() {
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/charities")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCharities(data))
      .catch((error) => {
        console.error("Error fetching charities:", error);
        setError("Failed to fetch charities. Please try again later.");
      });
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="charity-list-container">
      <h1 className="charity-list-title">Make a Difference Today</h1>
      <p className="charity-list-instruction">
        Browse through our selection of inspiring charities below. Click on a
        charity card to learn more and make a donation. Your support can change
        lives!
      </p>
      <div className="charity-grid">
        {charities.map((charity) => (
          <CharityCard key={charity.id} charity={charity} />
        ))}
      </div>
    </div>
  );
}

export default CharityList;
