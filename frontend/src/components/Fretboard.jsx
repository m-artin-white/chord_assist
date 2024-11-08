import React from 'react';

const Fretboard = ({ selectedNotes, onNoteSelect, onNoteDeselect, tuning }) => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  const calculateNote = (stringNote, fret) => {
    const noteIndex = notes.indexOf(stringNote);
    const newNoteIndex = (noteIndex + fret) % 12;
    return notes[newNoteIndex];
  };

  const handleFretClick = (stringIndex, fret) => {
    const openNote = tuning[stringIndex];
    const note = calculateNote(openNote, fret);
    const stringNumber = 6 - stringIndex;

    // Check if the note is already selected
    const isSelected = selectedNotes.some(
      n => n.string === stringNumber && n.fret === fret
    );

    if (isSelected) {
      onNoteDeselect({ string: stringNumber, fret });
    } else {
      onNoteSelect({ string: stringNumber, fret, note });
    }
  };

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
        {/* Fret numbers */}
        <div className="d-flex" style={{ height: '8%' }}>
          <div style={{ width: '3%' }}></div>
          {[...Array(16)].map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: `${5.8}%`,
                textAlign: 'center',
                fontSize: '11px'
              }}
            >
              {i}
            </div>
          ))}
        </div>
        
        {/* Strings and frets */}
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
              {/* String line */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                backgroundColor: '#808080',
                zIndex: 1
              }} />
              
              {/* Open note */}
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
              
              {/* Frets */}
              {[...Array(16)].map((_, fret) => (
                <div 
                  key={fret}
                  onClick={() => handleFretClick(stringIndex, fret)}
                  style={{ 
                    width: `${5.8}%`,
                    height: '100%',
                    borderRight: '2px solid #8b4513',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  {isNoteSelected(stringIndex, fret) && (
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
                      {calculateNote(openNote, fret)}
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
