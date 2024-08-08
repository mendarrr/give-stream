import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-middle">
        <div className="column">
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`}
              alt="logo"
            />
          </Link>
          <p>
            Give Stream is an Online Fundraising platform that connects Donors
            deserving charities and enables easy and secure charitable
            donations. We provide the most Secure, Transparent and convenient
            way for different charities to find donors for Medical Bills,
            Construction, Food relief, Emergencies, Funerals, School Fees and
            many more
          </p>
          <div className="social-links">
            <a href="https://www.facebook.com/givestream" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.twitter.com/givestream" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com/givestream"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/givestream" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/givestream"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>

          {/* <p>Get the app:</p>
          <div className="app-links">
            <a href="#">App Store</a>
            <a href="#">Google Play</a>
          </div> */}
        </div>
        <div className="column menu">
          <h3>MENU</h3>
          <nav>
            <ul>
              <li>
                <Link to="/faq">Questions</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/communities">Communities</Link>
              </li>
              <li>
                <Link to="/givestream-communities">
                  Give Stream communities
                </Link>
              </li>
              <li>
                <Link to="/givestream-fundraisers">
                  Give Stream Administered Fundraisers
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="column contact">
          <h3>CONTACT</h3>
          <p>123 Charity Lane, Nairobi, Kenya</p>
          <p>Phone: +254 123 456 789</p>
          <p>Email: info@givestream.com</p>
          <div className="country-badge">
            <span>🇰🇪</span>
            <p>Kenya, English</p>
          </div>
        </div>
      </div>

      <div className="border-top"></div>

      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2024 Give Stream. All Rights Reserved.
        </div>
        <div className="legal-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms" className="termss">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
