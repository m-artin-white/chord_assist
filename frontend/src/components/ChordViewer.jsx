import React, { useState } from 'react';
import Chord from '@tombatossals/react-chords/lib/Chord';
import guitarChords from '../chord_data/guitar.json'; 
import './ChordViewer.css'; 

const ChordViewer = () => {
  const [selectedNote, setSelectedNote] = useState('C'); // State to track the currently selected note, defaulting to "C"

  // Guitar instrument settings and tuning details
  const instrument = {
    strings: guitarChords.main.strings, // Number of strings on the guitar
    fretsOnChord: guitarChords.main.fretsOnChord, // Number of frets displayed per chord
    name: guitarChords.main.name, // Name of the instrument
    tunings: {
      standard: guitarChords.tunings.standard, // Standard guitar tuning
    },
  };

  const lite = false; // Option to enable/disable "lite" mode for the chord display

  // Mapping user-friendly note names to JSON keys in the data
  const noteMapping = {
    'C#': 'Csharp',
    'F#': 'Fsharp',
  };

  // Adjust finger data to replace -1 (no finger) with 0 for compatibility
  const sanitizeFingerData = (fingers) => {
    return fingers.map((finger) => (finger === -1 ? 0 : finger));
  };

  // Generate and render the chords for the selected note
  const renderChords = () => {
    const mappedNote = noteMapping[selectedNote] || selectedNote; // Use mapped key if it exists, otherwise use the selected note
    console.log('Selected Note:', selectedNote, 'Mapped Note:', mappedNote); // Debugging log to display note mappings
    const chordsForSelectedNote = guitarChords.chords[mappedNote] || []; // Retrieve chords for the mapped note

    // Warn if no chords are found for the selected note
    if (chordsForSelectedNote.length === 0) {
      console.warn(`No chords found for selected note: ${selectedNote}`);
    }

    // Map over the chords and generate Chord components for each position
    return chordsForSelectedNote.map((chord, index) => (
      <div key={`${selectedNote}-${index}`} className="chord-item">
        <h4>{chord.suffix}</h4> {/* Display the chord suffix (e.g., "maj", "min") */}
        {chord.positions.map((position, posIndex) => (
          <Chord
            key={`${selectedNote}-${index}-${posIndex}`} // Unique key for each chord position
            chord={{
              frets: position.frets, // Fret positions for the chord
              fingers: sanitizeFingerData(position.fingers), // Adjusted finger data
              barres: position.barres || [], // Barre information
              capo: position.capo || false, // Capo usage (if any)
            }}
            instrument={instrument} // Pass instrument details to the component
            lite={lite} // Lite mode option
          />
        ))}
      </div>
    ));
  };

  return (
    <div>
      <h2>Guitar Chords</h2>
      {/* Buttons for selecting notes */}
      <div className="note-buttons">
        {guitarChords.keys.map((note) => (
          <button
            key={note} // Unique key for each note button
            className={`note-button ${selectedNote === note ? 'active' : ''}`} // Highlight the active note
            onClick={() => setSelectedNote(note)} // Update the selected note on click
          >
            {note} {/* Display the note name */}
          </button>
        ))}
      </div>
      <h3>Selected Note: {selectedNote}</h3> {/* Display the currently selected note */}
      <div className="chord-grid">{renderChords()}</div> {/* Render the chord grid */}
    </div>
  );
};

export default ChordViewer;
