import React, { useState } from 'react';
import Chord from '@tombatossals/react-chords/lib/Chord';
import guitarChords from '../chord_data/guitar.json'; // Adjust the path as necessary
import './ChordViewer.css'; // Import custom CSS for styling

const ChordViewer = () => {
  const [selectedNote, setSelectedNote] = useState('C'); // Default selected note

  const instrument = {
    strings: guitarChords.main.strings,
    fretsOnChord: guitarChords.main.fretsOnChord,
    name: guitarChords.main.name,
    tunings: {
      standard: guitarChords.tunings.standard,
    },
  };

  const lite = false;

  // Map user-friendly note names to JSON keys
  const noteMapping = {
    'C#': 'Csharp',
    'F#': 'Fsharp',
  };

  const sanitizeFingerData = (fingers) => {
    return fingers.map((finger) => (finger === -1 ? 0 : finger));
  };

  const renderChords = () => {
    const mappedNote = noteMapping[selectedNote] || selectedNote; // Use mapped key if exists
    console.log('Selected Note:', selectedNote, 'Mapped Note:', mappedNote);
    const chordsForSelectedNote = guitarChords.chords[mappedNote] || [];
    if (chordsForSelectedNote.length === 0) {
      console.warn(`No chords found for selected note: ${selectedNote}`);
    }

    return chordsForSelectedNote.map((chord, index) => (
      <div key={`${selectedNote}-${index}`} className="chord-item">
        <h4>{chord.suffix}</h4>
        {chord.positions.map((position, posIndex) => (
          <Chord
            key={`${selectedNote}-${index}-${posIndex}`}
            chord={{
              frets: position.frets,
              fingers: sanitizeFingerData(position.fingers),
              barres: position.barres || [],
              capo: position.capo || false,
            }}
            instrument={instrument}
            lite={lite}
          />
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h2>Guitar Chords</h2>
      <div className="note-buttons">
        {guitarChords.keys.map((note) => (
          <button
            key={note}
            className={`note-button ${selectedNote === note ? 'active' : ''}`}
            onClick={() => setSelectedNote(note)}
          >
            {note}
          </button>
        ))}
      </div>
      <h3>Selected Note: {selectedNote}</h3>
      <div className="chord-grid">{renderChords()}</div>
    </div>
  );
};

export default ChordViewer;
