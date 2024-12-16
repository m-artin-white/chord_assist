// Importing necessary modules from external libraries

// React is a JavaScript library for building user interfaces. 
// It provides the base functionality for creating React components and rendering them.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from 'react';

// `Link` is a component from the `react-router-dom` library that enables navigation between different routes
// without reloading the page. It creates a seamless single-page application (SPA) experience.
// Documentation: https://reactrouter.com/en/main/components/link
import { Link } from 'react-router-dom';


function NavBar() {
  return (
    // Navbar container with fixed positioning at the top
    <nav className="navbar fixed-top navbar-expand-md navbar-light" style={{ backgroundColor: '#333333' }}>
      <div className="container-fluid">
        {/* Brand name displayed on the left side of the navbar */}
        <span className="navbar-brand mb-0 h1" style={{ color: '#FFFFFF' }}>Chord Assist</span>
        
        {/* Button for toggling the navbar collapse on smaller screens */}
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

        {/* Collapsible part of the navbar */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Link to the Chord Finder page */}
            <li className="nav-item">
              <Link className="nav-link" to="/" style={{ color: '#FFFFFF' }}>Chord Finder</Link>
            </li>
            {/* Link to the Chord Diagrams page */}
            <li className="nav-item">
              <Link className="nav-link" to="/chords" style={{ color: '#FFFFFF' }}>Chord Diagrams</Link>
            </li>
            {/* Link to the Chord Progressions page */}
            <li className="nav-item">
              <Link className="nav-link" to="/progressions" style={{ color: '#FFFFFF' }}>Chord Progressions</Link>
            </li>
            {/* Link to the Resources page */}
            <li className="nav-item">
              <Link className="nav-link" to="/resources" style={{ color: '#FFFFFF' }}>Resources</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
