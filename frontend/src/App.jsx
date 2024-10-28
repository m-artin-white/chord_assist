import './App.css';
import NavBar from './components/NavBar';
import ChordFinder from './components/ChordFinder';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<ChordFinder />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;