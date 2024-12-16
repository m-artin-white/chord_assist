// Importing necessary modules and components for testing

// React is a JavaScript library for building user interfaces. 
// It is imported here as a dependency for rendering React components in a test environment.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from 'react';

// Functions from the `vitest` library, a fast and lightweight testing framework:
// - `vi` allows for creating mocks and spies.
// - `describe` is used to group related test cases for better organization.
// - `test` defines individual test cases to evaluate specific behaviors.
// - `expect` is used to make assertions about the behavior of the tested code.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect } from 'vitest';

// Utilities from the `@testing-library/react` library are used to test React components by simulating user interactions and querying the rendered output:
// - `render` is used to render a component in the test environment.
// - `screen` provides querying utilities to interact with the rendered components.
// - `fireEvent` is used to simulate user interactions like clicks or keyboard events.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, screen, fireEvent } from '@testing-library/react';

// Importing the `ChordViewer` component from the application for testing.
// This component is responsible for displaying and interacting with guitar chord visualizations.
import ChordViewer from '../components/ChordViewer';

// Importing guitar chord data from a JSON file.
// This can either be a mock version or the actual dataset, depending on the test requirements.
// JSON files are typically used for pre-defined data structures to ensure consistency during testing.
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
