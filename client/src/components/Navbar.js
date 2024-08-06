import React from 'react'
import './Navbar.css'

function Navbar({ isSticky }) {
  return (
    <div className={`navbar-container ${isSticky ? 'sticky' : ''}`}>
        <div className={`navbar-logo ${isSticky ? 'sticky' : ''}`}>
        <img src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`} alt="logo" />
        </div>
        <div className={`nav-links ${isSticky ? 'sticky' : ''}`}>
            <ul>
                <li>Set up a Donation Campaign</li>
                <li>About Us</li>
                <li>Sign In</li>
                <li>My Account</li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar