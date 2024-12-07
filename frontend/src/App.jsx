import './App.css';
import NavBar from './components/NavBar';
import ChordFinder from './components/ChordFinder';
import ChordViewer from './components/ChordViewer'
import ProgressionViewer from './components/ProgressionViewer'
import Resources from './components/Resources';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<ChordFinder />} />
            <Route path="/chords" element={<ChordViewer />} />
            <Route path="/progressions" element={<ProgressionViewer />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;