import React from 'react';

const Fretboard = ({ selectedNotes, onNoteSelect, onNoteDeselect, tuning }) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']; // All musical notes

  // Calculate the note at a specific fret on a string
  const calculateNote = (stringNote, fret) => {
    const noteIndex = notes.indexOf(stringNote); // Find the index of the open string note
    const newNoteIndex = (noteIndex + fret) % 12; // Calculate the index of the note at the given fret
    return notes[newNoteIndex]; // Return the calculated note
  };

  // Handle the click event on a fret
  const handleFretClick = (stringIndex, fret) => {
    const openNote = tuning[stringIndex]; // Get the open note of the string
    const note = calculateNote(openNote, fret); // Calculate the note at the selected fret
    const stringNumber = 6 - stringIndex; // Convert stringIndex to string number (1-6)

    // Check if the note is already selected
    const isSelected = selectedNotes.some(
      n => n.string === stringNumber && n.fret === fret
    );

    if (isSelected) {
      onNoteDeselect({ string: stringNumber, fret }); // Deselect the note if it is already selected
    } else {
      onNoteSelect({ string: stringNumber, fret, note }); // Select the note if it is not already selected
    }
  };

  // Check if a specific note is selected
  const isNoteSelected = (stringIndex, fret) => {
    return selectedNotes.some(
      note => note.string === (6 - stringIndex) && note.fret === fret
    );
  };

  return (
    <div className="d-flex flex-column" style={{ 
      height: '90%', 
      width: '95%', 
      padding: '20px',
    }}>
      <div className="border border-dark rounded" 
           style={{ 
             backgroundColor: '#333333',
             color: 'white',
             flex: '1',
             display: 'flex',
             flexDirection: 'column',
             padding: '10px',
             position: 'relative'
           }}>
        {/* Fret numbers displayed horizontally */}
        <div className="d-flex" style={{ height: '8%' }}>
          <div style={{ width: '3%' }}></div> {/* Empty space for alignment */}
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: `${5.8}%`,
                textAlign: 'center',
                fontSize: '11px'
              }}
            >
              {i} {/* Fret number */}
            </div>
          ))}
        </div>
        
        {/* Strings and frets section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {tuning.map((openNote, stringIndex) => (
            <div 
              key={stringIndex} 
              className="d-flex align-items-center" 
              style={{ 
                flex: 1,
                position: 'relative', 
              }}
            >
              {/* String line visualization */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                backgroundColor: '#808080',
                zIndex: 1
              }} />
              
              {/* Display the open note of the string */}
              <div 
                style={{ 
                  width: '3%', 
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                  zIndex: 2
                }}
              >
                {openNote}
              </div>
              
              {/* Frets on the string */}
              {[...Array(16)].map((_, fret) => (
                <div 
                  key={fret}
                  onClick={() => handleFretClick(stringIndex, fret)} // Handle click event for the fret
                  style={{ 
                    width: `${5.8}%`,
                    height: '100%',
                    borderRight: '2px solid #8b4513', // Visualize frets
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {isNoteSelected(stringIndex, fret) && (
                    // Visual indicator for a selected note
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#c65102',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '11px'
                    }}>
                      {calculateNote(openNote, fret)} {/* Display the selected note */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fretboard;
