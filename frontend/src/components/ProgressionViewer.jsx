import React, { useState, useEffect } from "react";
import { Key, Progression } from "@tonaljs/tonal";

function ProgressionViewer() {
  const [chord, setChord] = useState("C"); // State to store the currently entered chord (default is "C")
  const [progressions, setProgressions] = useState([]); // State to store the generated progressions

  // Define progression templates with their names and Roman numeral patterns
  const progressionTemplates = [
    { name: "Basic Progression (I-IV-V-I)", roman: ["I", "IV", "V", "I"] },
    { name: "Pop Progression (I-V-vi-IV)", roman: ["I", "V", "vi", "IV"] },
    { name: "Jazz Progression (ii-V-I)", roman: ["ii", "V", "I"] },
    { name: "Blues Progression (I-IV-I-V-IV-I)", roman: ["I", "IV", "I", "V", "IV", "I"] },
    { name: "Circle Progression (I-vi-ii-V)", roman: ["I", "vi", "ii", "V"] },
    { name: "Minor Key Progression (i-iv-VII-III)", roman: ["i", "iv", "VII", "III"] },
    { name: "Descending Bass (I-V-vi-iii-IV-I-IV-V)", roman: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"] },
    { name: "Do-Wop Progression (I-vi-IV-V)", roman: ["I", "vi", "IV", "V"] },
    { name: "Classical Progression (I-ii-iii-IV-V)", roman: ["I", "ii", "iii", "IV", "V"] },
    { name: "Suspended Progression (I-sus4-IV)", roman: ["I", "sus4", "IV"] },
    { name: "Folk Progression (I-V-vi-V-IV)", roman: ["I", "V", "vi", "V", "IV"] },
    { name: "Modal Jazz Progression (ii7-bIIIMaj7)", roman: ["ii7", "bIIIMaj7"] },
    { name: "Rock Progression (I-bVII-IV-I)", roman: ["I", "bVII", "IV", "I"] },
  ];

  // Update the chord state when the input value changes
  const handleInputChange = (e) => {
    setChord(e.target.value);
  };

  // Generate progressions based on the selected chord and templates
  const handleGenerateProgressions = () => {
    try {
      const key = Key.majorKey(chord); // Get the key for the entered chord
      if (!key || key.chords.length === 0) {
        setProgressions([]); // Clear progressions if the chord is invalid
        return;
      }

      // Map through the templates and generate chord progressions
      const generatedProgressions = progressionTemplates.map((template) => {
        const chords = Progression.fromRomanNumerals(chord, template.roman); // Convert Roman numerals to chords
        return { name: template.name, chords, roman: template.roman }; // Return the template with chords
      });

      setProgressions(generatedProgressions); // Update state with generated progressions
    } catch (error) {
      console.error("Error generating progressions:", error); // Log any errors
      setProgressions([]); // Clear progressions if there's an error
    }
  };

  // Automatically generate progressions when the component mounts
  useEffect(() => {
    handleGenerateProgressions();
  }, []); // Empty dependency array ensures this runs only on mount

  return (
    <div style={{ marginTop: "50px", padding: "20px", fontFamily: "Arial" }}>
      {/* Input section for entering the chord */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <label
          htmlFor="chord-input"
          style={{
            marginRight: "10px",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Enter chord:
        </label>
        <input
          id="chord-input"
          type="text"
          placeholder="e.g., C, D#, Bb" // Example placeholder text
          value={chord} // Bind input value to state
          onChange={handleInputChange} // Update state on input change
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px",
          }}
        />
        <button
          onClick={handleGenerateProgressions} // Generate progressions when clicked
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          Generate Progressions
        </button>
      </div>

      {/* Display the generated progressions if any exist */}
      {progressions.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {progressions.map((prog, index) => (
            <div
              key={index} // Unique key for each progression
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                width: "300px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Display the name of the progression */}
              <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
                {prog.name}
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      Roman Numeral
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "5px",
                        textAlign: "left",
                      }}
                    >
                      Chord
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prog.chords.map((ch, i) => (
                    <tr key={i}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "5px",
                        }}
                      >
                        {prog.roman[i]} {/* Roman numeral for the chord */}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "5px",
                        }}
                      >
                        {ch} {/* Generated chord */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressionViewer;
