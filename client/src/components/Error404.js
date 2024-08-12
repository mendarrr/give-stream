import React from "react";
import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="main-error-page">
      <div className="error-contents">
        <div className="section1">
          <img src={`${process.env.PUBLIC_URL}/404.png`} alt="logo" />
          <h4>Page not Found</h4>
        </div>
        <div className="section2">
        <p>Oops! Page Not Found</p>
        <p>The page you are looking for has taken a detour or is busy making a difference elsewhere! Don't worry, we are here to help you get back on track:</p>
        <p><Link to="/" className="link">Return Home:</Link> Head back to our Homepage to discover amazing causes and ways to make an impact</p>
        </div>
        <div className="section3">
            <p>Here are some helpful suggestions:</p>
            <ul className="suggestions">
                <li>Double-check the URL: It's easy for a typo to sneak in!</li>
                <li>Use our search-bar: Type in keywords to find what you need</li>
            </ul>
            <p>Your support can change lives and we appreciate your visit. Let's make a difference together!</p>
        </div>
        <div className="section4">
            <p><Link to="/donor" className="link">Donate Now</Link> || <Link to="/about" className="link">Learn More About us</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Error404;
