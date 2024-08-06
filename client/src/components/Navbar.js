import React from 'react'
import './Navbar.css'

function Navbar() {
  return (
    <div className='navbar-container'>
        <div className='navbar-logo'>
        <img src={`${process.env.PUBLIC_URL}/GiveStreamLogo.png`} alt="logo" />
        </div>
        <div className='nav-links'>
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