import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; 
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import Fretboard from './Fretboard';
import chordData from "../chord_data/chords.json";
import UserPic from '../assets/user.png';
import ChatbotPic from '../assets/chatbot.png';

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

  const handleNoteSelection = (note) => {
    setSelectedNotes((prev) => {
      const filteredNotes = prev.filter(n => n.string !== note.string);
      const updatedNotes = [...filteredNotes, note];
      
      checkForMatchingChords(updatedNotes);
      return updatedNotes;
    });
  };

  const handleNoteDeselection = (note) => {
    setSelectedNotes((prev) => {
      const updatedNotes = prev.filter(
        n => !(n.string === note.string && n.fret === note.fret)
      );
      checkForMatchingChords(updatedNotes);
      return updatedNotes;
    });
  };

  const resetSelection = () => {
    setSelectedNotes([]);
    setPossibleChords([]);
  };

  const checkForMatchingChords = (notes) => {
    const uniqueSelectedNotes = [...new Set(notes.map(note => note.note))].sort();
    const matchingChords = chordData.chords.filter(chord => {
      const uniqueChordNotes = [...new Set(chord.notes)].sort();
      return JSON.stringify(uniqueChordNotes) === JSON.stringify(uniqueSelectedNotes);
    });

    setPossibleChords(matchingChords.map(chord => chord.name));
  };

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
              <Button onClick={handleSendMessage} variant="primary" disabled={loading}>
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send'}
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
          </div>
          <div style={styles.middleMiddle}>
            {selectedNotes.length === 1 
              ? `Note: ${selectedNotes[0].note}`
              : selectedNotes.length > 1
                ? `Chords: ${possibleChords.length > 0 ? possibleChords.join(', ') : 'No Chord Matched'}`
                : 'No Note Selected'}
          </div>
          <div style={styles.middleBottom}>
          </div>
        </Col>
        <Col xs={2} style={styles.rightSideSection}>
          <h5>Select Tuning</h5>
          {currentTuning.map((note, index) => (
            <Form.Group key={index} controlId={`tuning-select-${index}`}>
              <Form.Label>String {(6 + index)%6 + 1}</Form.Label>
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
