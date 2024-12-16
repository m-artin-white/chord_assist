// Importing necessary modules and components for testing

// React is a JavaScript library for building user interfaces. 
// It is imported here to enable the rendering and testing of React components in the test environment.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from 'react';

// Utilities from the `@testing-library/react` library are used for testing React components:
// - `render` is used to render a React component into the test environment.
// - `fireEvent` simulates user interactions, such as clicks or keypresses, on rendered components.
// - `screen` provides query utilities to access elements in the rendered component tree.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, fireEvent, screen } from '@testing-library/react';

// Importing the `Fretboard` component for testing.
// This component represents the interactive guitar fretboard in the application.
import Fretboard from '../components/Fretboard';

// Functions from the `vitest` library, which is a fast and lightweight testing framework:
// - `vi` is used to create mocks and spies for testing.
// - `describe` groups related test cases for better organization.
// - `test` defines individual test cases for specific functionality.
// - `expect` is used for making assertions about the component's behavior and output.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect } from 'vitest';


describe('Fretboard Component', () => {
  test('selects a note on fret click', () => {
    const mockSelect = vi.fn();
    const mockDeselect = vi.fn();

    render(
      <Fretboard
        selectedNotes={[]}
        onNoteSelect={mockSelect}
        onNoteDeselect={mockDeselect}
        tuning={['E', 'A', 'D', 'G', 'B', 'E']}
      />
    );

    // Instead of getByText('E'), use getAllByText('E') and choose the top E.
    // The first E in the tuning array is at stringIndex=0 (top).
    const allEs = screen.getAllByText('E');
    const topEOpenNote = allEs[0]; // Assume the top E is the first match

    // Find the parent line for that string (the one containing the E open note)
    const lineDiv = topEOpenNote.closest('.d-flex.align-items-center');
    if (!lineDiv) throw new Error('Could not find the E string line.');

    // Get all fret cells from this line by selecting divs styled as frets
    // Each fret cell has `cursor: pointer` and `border-right: 2px solid`
    const fretCells = Array.from(lineDiv.querySelectorAll('div[style*="cursor: pointer"]'));
    if (fretCells.length < 2) throw new Error('Not enough frets found.');

    // The first fret after the open note should be fretCells[0], since fret=0 is the open position.
    // Check if the logic in the component suggests that the first clickable fret is actually fret=1.
    // The code maps frets starting at 0, so to get fret=1, use fretCells[1].
    const firstFret = fretCells[1];

    fireEvent.click(firstFret);

    expect(mockSelect).toHaveBeenCalledWith({
      string: 6, // top stringIndex=0 maps to string number 6 in handleFretClick logic
      fret: 1,
      note: 'F',
    });
  });
});
