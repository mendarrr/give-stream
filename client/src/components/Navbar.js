import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar({ isSticky, isLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <li>
              <Link to="/account">My Account</Link>
            </li>
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
                    <Link to="/completed-charities">Communities</Link>
                  </li>
                  <li>
                    <Link to="/givestream-communities">
                      Give Stream communities
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
