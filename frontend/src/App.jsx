import './App.css';
import React from 'react'; 
import NavBar from './components/NavBar';
import ChordFinder from './components/ChordFinder';
import ChordViewer from './components/ChordViewer'
import ProgressionViewer from './components/ProgressionViewer'
import Resources from './components/Resources';
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