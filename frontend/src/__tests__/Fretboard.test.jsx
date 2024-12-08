import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Fretboard from '../components/Fretboard';
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
