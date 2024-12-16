import './App.css';
import React from 'react'; 
import NavBar from './components/NavBar';
import ChordFinder from './components/ChordFinder';
import ChordViewer from './components/ChordViewer'
import ProgressionViewer from './components/ProgressionViewer'
import Resources from './components/Resources';
// Importing necessary components from the `react-router-dom` library

// `BrowserRouter` (aliased as `Router`) is a higher-order component that provides the routing context 
// for the entire React application, enabling navigation between different views or pages.
// `Routes` is a container for all the route definitions within the application.
// `Route` is used to define individual routes, mapping paths to specific components.
// Documentation: https://reactrouter.com/en/main
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    // Setting up the Router to enable navigation between pages
    <Router>
      <div className="App">
        {/* Adding the navigation bar component */}
        <NavBar />
        <div className='main-content'>
          {/* Defining routes for different components */}
          <Routes>
            <Route path="/" element={<ChordFinder />} /> {/* Home route displays the ChordFinder component */}
            <Route path="/chords" element={<ChordViewer />} /> {/* Route for viewing chords */}
            <Route path="/progressions" element={<ProgressionViewer />} /> {/* Route for viewing chord progressions */}
            <Route path="/resources" element={<Resources />} /> {/* Route for accessing resources */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;