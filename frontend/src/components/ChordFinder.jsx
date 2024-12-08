import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import Fretboard from './Fretboard';
import UserPic from '../assets/user.png';
import ChatbotPic from '../assets/chatbot.png';
import * as Chord from '@tonaljs/chord';
import * as Tone from 'tone';
import * as Note from '@tonaljs/note';

const ChordFinder = () => {
  // Setting up the styles for different components on the UI.
  const styles = {
    mainContainer: {
      minHeight: '100vh',
      maxHeight: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    },
    fullHeightRow: {
      minHeight: '100vh',
      margin: 0
    },
    leftSideSection: {
      backgroundColor: 'white',
      padding: '15px',
      paddingBottom: '0px',
      marginTop: '30px',
      height: '91vh',
      borderRight: '5px solid lightgrey',
    },
    rightSideSection: {
      backgroundColor: 'white',
      padding: '15px',
      marginTop: '50px',
    },
    chatContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
      borderRadius: '5px',
      padding: '10px',
      backgroundColor: 'white',
      marginTop: '10px',
    },
    chatMessages: {
      flex: 1,
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: 'white',
      height: '300px',
      textAlign: 'left',
      overflowY: 'scroll',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    },
    chatInputContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '2px'
    },
    chatInput: {
      flex: 1,
      marginRight: '5px'
    },
    messageContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      marginBottom: '10px'
    },
    profilePic: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      marginRight: '10px'
    },
    middleSection: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      padding: 0
    },
    middleTop: {
      flex: 3,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      marginTop: '30px'
    },
    middleMiddle: {
      flex: 1,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px'
    },
    middleBottom: {
      flex: 1,
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px'
    }
  };

  // Setting up state variable to keep track of currently selected notes on fretboard.
  const [selectedNotes, setSelectedNotes] = useState([]);
  // Setting up state variable to keep track of possible chords that the selected notes may represent.
  const [possibleChords, setPossibleChords] = useState([]);
  // State variable to hold messages from chatbot.
  const [messages, setMessages] = useState([
    {
      sender: 'Bot',
      text: 'Welcome! I am The String Sage, your guide to music theory, guitar chords, and chord progressions. Feel free to ask any questions related to these topics!'
    }
  ]);
  // State variable for user messages to chatbot.
  const [input, setInput] = useState('');
  // State variable to track loading state.
  const [loading, setLoading] = useState(false);
  // State variable to capture current tuning of fretboard.
  const [currentTuning, setCurrentTuning] = useState(['E', 'B', 'G', 'D', 'A', 'E']);

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Function to update current tuning of fretboard.
  const handleTuningChange = (stringIndex, newNote) => {
    const updatedTuning = [...currentTuning];
    updatedTuning[stringIndex] = newNote;
    setCurrentTuning(updatedTuning);
  };

  // Function to handle note selection. 
  const handleNoteSelection = (note) => {
    setSelectedNotes((prev) => {
      const filteredNotes = prev.filter(n => n.string !== note.string);
      const updatedNotes = [...filteredNotes, note];
      
      checkForMatchingChords(updatedNotes);
      return updatedNotes;
    });
  };

  // Function to handle note deselection.
  const handleNoteDeselection = (note) => {
    setSelectedNotes((prev) => {
      const updatedNotes = prev.filter(
        n => !(n.string === note.string && n.fret === note.fret)
      );
      checkForMatchingChords(updatedNotes);
      return updatedNotes;
    });
  };

  // Function to reset fretboard (clear selected notes).
  const resetSelection = () => {
    setSelectedNotes([]);
    setPossibleChords([]);
  };

  // Function that uses tonaljs/chord api to find chords for a set of notes.
  const checkForMatchingChords = (notes) => {
    // Extract the note names from the selected notes
    const noteNames = notes.map(note => note.note);

    // Use the @tonaljs/chord library to detect possible chords
    const detectedChords = Chord.detect(noteNames);

    // Set possible chords found
    setPossibleChords(detectedChords);
  };

  // Function to interact with chatbot.
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { sender: 'User', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true); // Start loading spinner
  
    // Determine whether it's a "Note" or "Chord"
    const noteOrChord = selectedNotes.length === 1 
      ? `Note: ${selectedNotes[0].note}` 
      : selectedNotes.length > 1 
        ? `Chord: ${possibleChords.join(', ')}` 
        : '';
  
    try {
      const formData = new FormData();
      formData.append("text", input);
      formData.append("noteOrChord", noteOrChord); // Match key with FastAPI parameter
  
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const botMessage = { sender: 'Bot', text: response.data.message };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'Bot', text: 'Sorry, there was an error processing your question.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const playChord = async () => {
    await Tone.start();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

   
    const stringOctaves = {
      1: 2, // Low E string (formerly string 6)
      2: 2, // A string (formerly string 5)
      3: 3, // D string (formerly string 4)
      4: 3, // G string (formerly string 3)
      5: 3, // B string (formerly string 2)
      6: 4  // High E string (formerly string 1)
    };

    selectedNotes.forEach(note => {
      const stringNumber = note.string; 
      const baseNote = note.note.replace(/[0-9]/g, ''); 
      let octave = stringOctaves[stringNumber];

    
      if (note.fret >= 6) {
          octave += 1;
      }

      const noteWithOctave = `${baseNote}${octave}`; 
      const midiNote = Note.midi(noteWithOctave); 
      const formattedNote = Note.fromMidi(midiNote); 
      console.log(formattedNote); 
      console.log(`String: ${note.string}, Fret: ${note.fret}, Base Note: ${baseNote}, Octave: ${octave}`);
      synth.triggerAttackRelease(formattedNote, "8n", now);
  });
};

return (
  // Main container wrapping the entire layout, making it fluid to use the full viewport width
  <Container fluid style={styles.mainContainer}> 
    
    {/* Row component ensuring full-height distribution of the sections */}
    <Row style={styles.fullHeightRow}>
      
      {/* Left column for the chat section */}
      <Col xs={3} style={styles.leftSideSection}> 
        <div style={styles.chatContainer}> 
          
          {/* Chat messages section to display user and chatbot messages */}
          <div style={styles.chatMessages}> 
            {messages.map((msg, index) => (
              // Individual message container with unique key for each message
              <div key={index} style={styles.messageContainer}> 
                
                {/* Display user or chatbot profile picture based on the sender */}
                <img 
                  src={msg.sender === 'User' ? UserPic : ChatbotPic} 
                  alt={`${msg.sender} avatar`} 
                  style={styles.profilePic} 
                />
                
                {/* Render message text using ReactMarkdown for markdown support */}
                <div style={{ color: '#000000' }}> 
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat input container with text input and send button */}
          <div style={styles.chatInputContainer}> 
            <Form.Control 
              type="text" 
              placeholder="Message Chord Assist..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} // Updates input state
              style={styles.chatInput} 
            />
            <Button 
              onClick={handleSendMessage} 
              variant="primary" 
              disabled={loading} // Disables the button if loading
            >
              {loading 
                ? <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                  /> 
                : 'Send'} {/*Displays spinner if loading, otherwise "Send" */} 
            </Button>
          </div>
        </div>
      </Col>
      
      {/* Middle column for fretboard and chord-related functionality */}
      <Col xs={7} style={styles.middleSection}> 
        <div style={styles.middleTop}> 
          
          {/* Fretboard component with handlers for note selection/deselection */}
          <Fretboard 
            selectedNotes={selectedNotes} 
            onNoteSelect={handleNoteSelection} 
            onNoteDeselect={handleNoteDeselection} 
            tuning={currentTuning} // Uses current tuning for the fretboard
          />
        </div>
        
        {/* Reset and play chord buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}> 
          <Button variant="danger" onClick={resetSelection}>Reset</Button>
          <Button 
            variant="success" 
            onClick={playChord} 
            style={{ marginLeft: '10px' }}
          >
            Play Chord
          </Button>
        </div>
        
        {/* Display selected notes or possible chords based on the selection */}
        <div style={styles.middleMiddle}> 
          {selectedNotes.length === 1 
            ? `Note: ${selectedNotes[0].note}` 
            : selectedNotes.length > 1 
              ? `Chords: ${possibleChords.length > 0 
                  ? possibleChords.join(', ') 
                  : 'No Chord Matched'}` 
              : 'No Note Selected'}
        </div>
        
        {/* Placeholder for additional components or information */}
        <div style={styles.middleBottom}> 
        </div>
      </Col>
      
      {/* Right column for tuning selection */}
      <Col xs={2} style={styles.rightSideSection}> 
        <h5>Select Tuning</h5>
        
        {/* Render dropdown selectors for each string's tuning */}
        {currentTuning.map((note, index) => (
          <Form.Group key={index} controlId={`tuning-select-${index}`}> 
            <Form.Label>String {(6 + index) % 6 + 1}</Form.Label>
            <Form.Control 
              as="select" 
              value={note} 
              onChange={(e) => handleTuningChange(index, e.target.value)} // Update tuning state
            >
              {notes.map((n, i) => (
                // Dropdown options for all possible notes
                <option key={i} value={n}>{n}</option> 
              ))}
            </Form.Control>
          </Form.Group>
        ))}
      </Col>
    </Row>
  </Container>
);

};

export default ChordFinder;
