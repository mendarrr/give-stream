import React from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

function HomePage() {
  return (
    <div>
      <h1>Welcome to Charity Donations</h1>
      <Link to="/charities">
        <button>Donate Now</button>
      </Link>
    </div>
  );
}

export default HomePage;
