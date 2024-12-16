// Importing necessary modules and components

// React is a JavaScript library for building user interfaces. 
// `useState` is a Hook that enables state management in functional components, and `useEffect` is used for handling side effects, such as data fetching or DOM updates.
// Documentation: https://reactjs.org/docs/getting-started.html
import React, { useState, useEffect } from 'react';

// Axios is a promise-based HTTP client for making API requests from the frontend.
// It is used here to interact with the backend API and fetch data.
// Documentation: https://axios-http.com/docs/intro
import axios from 'axios';

// ReactMarkdown is a library for rendering Markdown content in React applications.
// This simplifies the process of displaying Markdown-formatted text.
// Documentation: https://github.com/remarkjs/react-markdown
import ReactMarkdown from 'react-markdown';

// Components from `react-bootstrap` are used for creating a responsive, styled UI:
// - `Container`, `Row`, and `Col` help structure the layout.
// - `Button`, `Form`, and `Spinner` provide styled UI elements for user interaction and feedback.
// Documentation: https://react-bootstrap.github.io/
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';

// Custom components and assets
// `Fretboard` is a custom React component used for displaying an interactive guitar fretboard.
// `UserPic` and `ChatbotPic` are image assets representing the user and chatbot avatars, respectively.
import Fretboard from './Fretboard';
import UserPic from '../assets/user.png';
import ChatbotPic from '../assets/chatbot.png';

// Tonal.js libraries for advanced music theory functionality
// - `Chord` provides tools for chord analysis and generation.
// - `Tone` is used for sound synthesis and audio generation in a musical context.
// - `Note` enables operations with musical notes, such as parsing or transposing.
// Documentation: https://github.com/tonaljs/tonal
import * as Chord from '@tonaljs/chord';
import * as Tone from 'tone';
import * as Note from '@tonaljs/note';


const ChordFinder = () => {
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

  const [selectedNotes, setSelectedNotes] = useState([]);
  const [possibleChords, setPossibleChords] = useState([]);
  const [messages, setMessages] = useState([
    {
      sender: 'Bot',
      text: 'Welcome! I am The String Sage, your guide to music theory, guitar chords, and chord progressions. Feel free to ask any questions related to these topics!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTuning, setCurrentTuning] = useState(['E', 'B', 'G', 'D', 'A', 'E']);

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const handleTuningChange = (stringIndex, newNote) => {
    const updatedTuning = [...currentTuning];
    updatedTuning[stringIndex] = newNote;
    setCurrentTuning(updatedTuning);
  };

  const handleNoteSelection = (selectedNote) => {
    // selectedNote should have string, fret, and note (from Fretboard)
    // But we decided to store only string, fret.
    setSelectedNotes((prev) => {
      const filteredNotes = prev.filter(n => n.string !== selectedNote.string);
      const updatedNotes = [...filteredNotes, { string: selectedNote.string, fret: selectedNote.fret }];
      return updatedNotes;
    });
  };
  
  const handleNoteDeselection = (noteToDeselect) => {
    setSelectedNotes((prev) => 
      prev.filter(n => !(n.string === noteToDeselect.string && n.fret === noteToDeselect.fret))
    );
  };

  const calculateNoteFromTuningAndFret = (openNote, fret) => {
    const noteIndex = notes.indexOf(openNote);
    if (noteIndex === -1) {
      // This should not happen if tuning notes match the notes array
      return openNote;
    }
    const newIndex = (noteIndex + fret) % notes.length;
    return notes[newIndex];
  };

  const getNoteName = (stringNumber, fret) => {
    // stringNumber is 1-6, but currentTuning is indexed 0-5 with
    // string 6 (low E) at currentTuning[0] and string 1 (high E) at currentTuning[5].
    // Currently in Fretboard, we defined stringNumber as 6 - stringIndex to get 1 through 6.
    // Thus, to map back: stringIndex = 6 - stringNumber.
    const stringIndex = 6 - stringNumber;
    const openNote = currentTuning[stringIndex];
    return calculateNoteFromTuningAndFret(openNote, fret);
  };

  const resetSelection = () => {
    setSelectedNotes([]);
    setPossibleChords([]);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { sender: 'User', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true); // Start loading spinner

    let noteOrChord = '';
    if (selectedNotes.length === 1) {
      const singleNoteName = getNoteName(selectedNotes[0].string, selectedNotes[0].fret);
      noteOrChord = `Note: ${singleNoteName}`;
    } else if (selectedNotes.length > 1) {
      noteOrChord = `Chord: ${possibleChords.join(', ')}`;
    }

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

    selectedNotes.forEach(sel => {
      const baseNote = getNoteName(sel.string, sel.fret); 
      let octave = stringOctaves[sel.string];
      if (sel.fret >= 6) {
        octave += 1;
      }

      const noteWithOctave = `${baseNote}${octave}`;
      const midiNote = Note.midi(noteWithOctave); 
      const formattedNote = Note.fromMidi(midiNote); 
      synth.triggerAttackRelease(formattedNote, "8n", now);
    });
  };

  useEffect(() => {
    // Recalculate chord suggestions whenever selectedNotes or tuning changes
    const noteNames = selectedNotes.map(sn => getNoteName(sn.string, sn.fret));
    const detectedChords = Chord.detect(noteNames);
    setPossibleChords(detectedChords);
  }, [selectedNotes, currentTuning]);

  const singleNoteName = selectedNotes.length === 1 
    ? getNoteName(selectedNotes[0].string, selectedNotes[0].fret)
    : '';

  return (
    <Container fluid style={styles.mainContainer}> 
      <Row style={styles.fullHeightRow}>
        <Col xs={3} style={styles.leftSideSection}> 
          <div style={styles.chatContainer}> 
            <div style={styles.chatMessages}> 
              {messages.map((msg, index) => (
                <div key={index} style={styles.messageContainer}> 
                  <img 
                    src={msg.sender === 'User' ? UserPic : ChatbotPic} 
                    alt={`${msg.sender} avatar`} 
                    style={styles.profilePic} 
                  />
                  <div style={{ color: '#000000' }}> 
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.chatInputContainer}> 
              <Form.Control 
                type="text" 
                placeholder="Message Chord Assist..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                style={styles.chatInput} 
              />
              <Button 
                onClick={handleSendMessage} 
                variant="primary" 
                disabled={loading}
              >
                {loading 
                  ? <Spinner 
                      as="span" 
                      animation="border" 
                      size="sm" 
                      role="status" 
                      aria-hidden="true" 
                    /> 
                  : 'Send'}
              </Button>
            </div>
          </div>
        </Col>
        
        <Col xs={7} style={styles.middleSection}> 
          <div style={styles.middleTop}> 
            <Fretboard 
              selectedNotes={selectedNotes} 
              onNoteSelect={handleNoteSelection} 
              onNoteDeselect={handleNoteDeselection} 
              tuning={currentTuning}
            />
          </div>
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
          <div style={styles.middleMiddle}> 
            {selectedNotes.length === 1 
              ? `Note: ${singleNoteName}` 
              : selectedNotes.length > 1 
                ? `Chords: ${possibleChords.length > 0 
                    ? possibleChords.join(', ') 
                    : 'No Chord Matched'}`
                : 'No Note Selected'}
          </div>
          <div style={styles.middleBottom}> 
          </div>
        </Col>
        
        <Col xs={2} style={styles.rightSideSection}> 
          <h5>Select Tuning</h5>
          {currentTuning.map((note, index) => (
            <Form.Group key={index} controlId={`tuning-select-${index}`}> 
              <Form.Label>String {(6 + index) % 6 + 1}</Form.Label>
              <Form.Control 
                as="select" 
                value={note} 
                onChange={(e) => handleTuningChange(index, e.target.value)}
              >
                {notes.map((n, i) => (
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
