import React, { useState, useEffect } from "react";

const ChordViewer = () => {
  const [chordName, setChordName] = useState('Am');
  const [searchTrigger, setSearchTrigger] = useState(false);

  const handleInputChange = (event) => {
    setChordName(event.target.value);
  };

  const handleSearch = (event) => {
    console.log("hello");
    event.preventDefault(); // Prevent page reload
    const insNew = document.createElement("ins");
    insNew.setAttribute("class", "scales_chords_api");
    insNew.setAttribute("chord", chordName);
    insNew.async = true;
    document.body.appendChild(insNew);
    setSearchTrigger(!searchTrigger);
  };

  return (
    <div style={{ paddingTop: '60px', textAlign: 'center' }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={chordName}
          onChange={handleInputChange}
          placeholder="Search for a chord"
          style={{ marginBottom: '20px', padding: '10px', fontSize: '16px' }}
        />
        <button type="submit">Search</button>
      </form>
      <div key={searchTrigger}>
      <ins class="scales_chords_api" chord={chordName} id="scapiobjid1"></ins>
      </div>
    </div>
  );
};
const script = document.createElement("script");
script.src = "https://www.scales-chords.com/api/scales-chords-api.js";
script.async = true;
document.body.appendChild(script);

export default ChordViewer;
