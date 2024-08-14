import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext"; 
import { useNavigate } from "react-router-dom";

function Navbar({ isSticky }) { // Removed isLoggedIn prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isLoggedIn } = useAuth(); // Now destructuring isLoggedIn from useAuth
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from your AuthContext
    navigate('/'); // Navigate to the homepage after logout
  };

  return (
    <div className={`navbar-container ${isSticky ? "sticky" : ""}`}>
      <div className={`navbar-logo ${isSticky ? "sticky" : ""}`}>
        <Link to="/">
          <img
            src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`}
            alt="logo"
          />
        </Link>
      </div>
      <nav className={`nav-links ${isSticky ? "sticky" : ""}`}>
        <ul>
          <li>
            <Link to="/create-campaign">Set up a Donation Campaign</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <button onClick={handleLogout}>Logout</button> {/* Functional logout button */}
              </li>
            </>
          ) : (
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
          )}
          <li className="menu-icon" onClick={toggleMenu}>
            <i className="fas fa-ellipsis-v"></i>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li>
                    <Link to="/faq">Questions</Link>
                  </li>
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/communities">Communities</Link>
                  </li>
                  <li>
                    <Link to="/communities">
                      Give Stream Communities
                    </Link>
                  </li>
                  <li>
                    <Link to="/completed-charities">
                      Give Stream Administered Fundraisers
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
