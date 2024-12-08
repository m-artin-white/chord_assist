import React from 'react';
import { vi, describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChordViewer from '../components/ChordViewer';
import guitarChords from '../chord_data/guitar.json'; // Mock or use actual JSON data

// Mock the Chord component from @tombatossals/react-chords
vi.mock("@tombatossals/react-chords/lib/Chord", () => ({
  default: () => <div data-testid="mocked-chord">Mocked Chord</div>, // Mocked structure
}));

// Mock console.warn for the test
const mockWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('ChordViewer Component', () => {
  test('renders note buttons correctly', () => {
    render(<ChordViewer />);

    // Check if all note buttons are rendered
    guitarChords.keys.forEach((note) => {
      expect(screen.getByText(note)).toBeInTheDocument();
    });
  });

  test('updates the selected note when a button is clicked', () => {
    render(<ChordViewer />);

    const noteButton = screen.getByText('G'); // Replace 'G' with any valid note in the keys
    fireEvent.click(noteButton);

    // Check if the selected note is updated
    expect(screen.getByText('Selected Note: G')).toBeInTheDocument();
  });

  test('renders chords for the selected note', () => {
    render(<ChordViewer />);

    // Select a note with chords in the JSON
    const noteButton = screen.getByText('C'); // Replace 'C' with a valid note that has chords
    fireEvent.click(noteButton);

    // Check if mocked chord components are rendered
    const chordItems = screen.getAllByTestId('mocked-chord');
    expect(chordItems.length).toBeGreaterThan(0);

    // Ensure chords display correct fret and finger data (mock data logic)
    expect(chordItems[0]).toBeInTheDocument(); // Mocked chord presence
  });
});
