import React, { useState, useEffect } from "react";
import { Key, Progression } from "@tonaljs/tonal";

function ProgressionViewer() {
  const [chord, setChord] = useState("C"); // Default chord set to "C"
  const [progressions, setProgressions] = useState([]);

  // Define progression types
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

  const handleInputChange = (e) => {
    setChord(e.target.value);
  };

  const handleGenerateProgressions = () => {
    try {
      const key = Key.majorKey(chord);
      if (!key || key.chords.length === 0) {
        setProgressions([]);
        return;
      }

      // Generate progressions for all templates
      const generatedProgressions = progressionTemplates.map((template) => {
        const chords = Progression.fromRomanNumerals(chord, template.roman);
        return { name: template.name, chords, roman: template.roman };
      });

      setProgressions(generatedProgressions);
    } catch (error) {
      console.error("Error generating progressions:", error);
      setProgressions([]);
    }
  };

  // Use `useEffect` to generate progressions when the component mounts
  useEffect(() => {
    handleGenerateProgressions();
  }, []);

  return (
    <div style={{ marginTop: "50px", padding: "20px", fontFamily: "Arial" }}>
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
          placeholder="e.g., C, D#, Bb"
          value={chord}
          onChange={handleInputChange}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "250px",
          }}
        />
        <button
          onClick={handleGenerateProgressions}
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
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                width: "300px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
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
                        {prog.roman[i]}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "5px",
                        }}
                      >
                        {ch}
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
