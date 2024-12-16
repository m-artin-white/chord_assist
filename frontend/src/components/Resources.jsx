import React from 'react';

function Resources() {
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    list: {
      listStyleType: 'none',
      padding: 0,
    },
    listItem: {
      marginBottom: '10px',
    },
    link: {
      textDecoration: 'none',
      color: '#007bff',
    },
    linkHover: {
      textDecoration: 'underline',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Useful Resources</h1>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <a href="https://www.musictheory.net/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Music Theory .net site, a great resource for learning music theory.
          </a>
        </li>
        <li style={styles.listItem}>
          <a href="https://www.ultimate-guitar.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Ultimate Guitar, a popular site for guitar tabs and chords.
          </a>
        </li>
        <li style={styles.listItem}>
          <a href="https://chordify.net/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Chordify, a site that automatically generates chords for any song.
          </a>
        </li>
        <li style={styles.listItem}>
          <a href="https://www.songsterr.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Songsterr, an online tab player with real-time scrolling.
          </a>
        </li>
        <li style={styles.listItem}>
          <a href="https://www.teoria.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Teoria, a site for music theory tutorials and exercises.
          </a>
        </li>
        <li style={styles.listItem}>
          <a href="https://www.jamplay.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            JamPlay, an online guitar lesson platform.
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Resources;
