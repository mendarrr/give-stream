import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CharityList from "./CharityList";
import "./HomePage.css";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);  

  useEffect(() => {
    fetch("http://127.0.0.1:5000/dashboard/common")
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
      <Navbar isSticky={isSticky} />
      </div>
      <div className="home-content">
        <section className="counter-container">
          <div className="counter-text">
            <h2>A Crowdfunding Platform</h2>
            <h3>Simple. Fast. Secure</h3>
          </div>
          <div className="counter-numbers">
            <div className="insight">
              <h2>Ksh {animatedData.total_donations}</h2>
              <p>Total Donations</p>
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
            <h1>Meet your Charity and Donation Goals with <span className="givestream">GIVE STREAM</span></h1>
          </div>
            <a href="#charities-section" id="counter-button" className="counter-button">Donate Now</a>
        </section>
        <section id="charities-section" className="charities-list">
            <div className="charities-section-text">
                <h3>Discover fundraisrs and Charity Initiatives you might care about</h3>
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
        <section className="completed-fundraisers"></section>
        <section className="how-givestream-works"></section>
        <section className="fundraise"></section>
      </div>
    </div>
  );
};

export default HomePage;
