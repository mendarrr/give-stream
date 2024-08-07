import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import Navbar from "./Navbar";
import CharityList from "./CharityList";
import CompletedCharitiesList from "./CompletedCharitiesList";
import "./HomePage.css";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSticky, setIsSticky] = useState(false);
  const [dashboardData, setDashboardData] = useState({});
  const [animatedData, setAnimatedData] = useState({
    total_donations: 0,
    charity_count: 0,
    total_users: 0,
  });

  const animateCount = (start, end, duration, setter) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setter(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    fetch("/dashboard/common")
      .then((response) => response.json())
      .then((data) => {
        setDashboardData(data);
        animateCount(0, data.total_donations, 2000, (value) =>
          setAnimatedData((prev) => ({ ...prev, total_donations: value }))
        );
        animateCount(0, data.charity_count, 2000, (value) =>
          setAnimatedData((prev) => ({ ...prev, charity_count: value }))
        );
        animateCount(0, data.total_users, 2000, (value) =>
          setAnimatedData((prev) => ({ ...prev, total_users: value }))
        );
      });
  }, []);

  return (
    <div className="main-home-container">
      <div className="home-navbar">
        <Navbar isSticky={isSticky} isLoggedIn={isLoggedIn} />
      </div>
      <div className="home-content">
        <section className="counter-container">
          <div className="counter-text">
            <h2>A Crowdfunding Platform</h2>
            <h3>Simple. Fast. Secure</h3>
          </div>
          <div className="counter-numbers">
            <div className="insight">
              <h2>{animatedData.total_donations}</h2>
              <p>Total Donations (KES) </p>
            </div>
            <div className="insight">
              <h2>{animatedData.charity_count}</h2>
              <p>Charities</p>
            </div>
            <div className="insight">
              <h2>{animatedData.total_users}</h2>
              <p>Total Users</p>
            </div>
          </div>
          <div className="counter-text2">
            <h1>
              Meet your Charity and Donation Goals with{" "}
              <span className="givestream">GIVE STREAM</span>
            </h1>
          </div>
          <a
            href="#charities-section"
            id="counter-button"
            className="counter-button"
          >
            Donate Now
          </a>
        </section>
        <section id="charities-section" className="charities-list">
          <div className="charities-section-text">
            <h3>
              Discover fundraisers and Charity Initiatives you might care about
            </h3>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a charity"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="list-of-charities">
            <CharityList searchTerm={searchTerm} />
          </div>
        </section>
        <section className="completed-fundraisers">
          <div className="completed-list">
            <CompletedCharitiesList searchTerm={searchTerm} />
          </div>
          <div className="completed-fundraisers-text">
            <h2>Fundraisers initiated and run by Give Stream</h2>
            <p>
              At Give Stream, We are commited to driving meaningful change
              across Africa and the world at large. Our Platform not only
              connects generous donors with deserving courses but also initiates
              it's own impactful fundraisers. Each of our projects is designed
              to address critical needs and uplift communities focusing on areas
              such as education healthcare and economic empowerment. By
              Spearheading these Initiatives, we ensure that every contribution
              makes a tangible business ensurin. Fostering a brighter future for
              all. Join us in in our mission to create lasting change, one
              fundraiser at a time.
            </p>
          </div>
        </section>
        <section className="how-givestream-works">
          <img
            src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`}
            alt="logo"
          />
          <div className="how-givestream-works-text">
            <h3>Secure Trusted Donations with Give Stream</h3>
            <p>
              Give Stream is an innovative platform that connects donors with
              deserving organizations. Our mission is to empower individuals to
              make a meaningful contribution to the lives of those in need. By
              helping people find and support organizations that truly care, we
              foster a sense of belonging and empowerment.
            </p>
          </div>
          <div className="works-text">
            <h4>How Give Stream Works</h4>
          </div>
          <div className="tutorial-btn">
            <button>
              <i class="fa-solid fa-play"></i> Play 1 min Video
            </button>
          </div>
        </section>
        <section className="fundraise"></section>
        <section className="homepage-footer">
          <div className="footer-top">
            <nav>
              <ul>
                <li>
                  <span>&copy; 2024 Give Stream</span>
                </li>
                <li>
                  <Link to="/terms">Terms</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Notice</Link>
                </li>
                <li>
                  <Link to="/legal">Legal</Link>
                </li>
                <li>
                  <Link to="/accessibility">Accessibility Statement</Link>
                </li>
                <li>
                  <Link to="/cookie-policy">Cookie Policy</Link>
                </li>
                <li>
                  <Link to="/privacy-choices">Your Privacy Choices</Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
