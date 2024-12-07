import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const [isHovered, setIsHovered] = useState(false);

  const loginButtonStyle = {
    color: isHovered ? '#333333' : '#FFFFFF', // White text, changes to dark on hover
    backgroundColor: isHovered ? '#FFFFFF' : '#333333', // Dark background, changes to white on hover
    border: '1px solid #FFFFFF', // Adds a white border for better consistency
    padding: '8px 16px', // Additional padding for a more button-like feel
    borderRadius: '4px', // Rounded corners for consistency
    transition: 'all 0.3s ease', // Smooth transition effect
  };

  return (
    <nav className="navbar fixed-top navbar-expand-md navbar-light" style={{ backgroundColor: '#333333' }}>
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1" style={{ color: '#FFFFFF' }}>Chord Assist</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: '#FFFFFF' }}>Chord Finder</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chords" style={{ color: '#FFFFFF' }}>Chord Diagrams</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/progressions" style={{ color: '#FFFFFF' }}>Chord Progressions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/resources" style={{ color: '#FFFFFF' }}>Resources</Link>
            </li>
          </ul>
          {/* <button
            type="button"
            className="btn"
            style={loginButtonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Login
          </button> */}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
