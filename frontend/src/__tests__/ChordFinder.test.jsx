// Importing necessary modules and components for testing

// `render`, `screen`, and `fireEvent` are utilities from the `@testing-library/react` library, 
// which is used to test React components by simulating user interactions and verifying expected outcomes.
// - `render` renders components into a test environment for evaluation.
// - `screen` provides utilities to query rendered components.
// - `fireEvent` is used to simulate low-level user interactions, like clicks or keypresses.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, screen, fireEvent } from '@testing-library/react';

// Functions from the `vitest` library, a lightweight and fast testing framework:
// - `vi` allows creating mocks and spies for functions or modules.
// - `describe` groups related test cases for better organization.
// - `test` defines individual test cases.
// - `expect` is used to write assertions about the behavior of the tested code.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect } from 'vitest';

// Axios is a promise-based HTTP client used here for testing API interactions.
// Documentation: https://axios-http.com/docs/intro
import axios from 'axios';

// Importing the `ChordFinder` component from the application's components directory for testing.
// This allows simulating and validating its behavior in a controlled test environment.
import ChordFinder from '../components/ChordFinder';

// `userEvent` is a higher-level API from `@testing-library/user-event` for simulating user interactions 
// such as typing and clicking in a way that closely resembles real-world usage.
// Documentation: https://testing-library.com/docs/user-event/intro/
import userEvent from '@testing-library/user-event';

// React is a JavaScript library for building user interfaces. 
// It is imported here as a dependency for rendering React components during testing.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from 'react';


// We need to mock Tone with a fully functional stand-in for PolySynth
vi.mock('tone', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    start: vi.fn(),
    // Mock PolySynth to return a safe object that won't try to use the real audio context
    PolySynth: vi.fn(() => ({
      toDestination: vi.fn().mockReturnThis(),
      triggerAttackRelease: vi.fn(),
    })),
    Synth: vi.fn(), // If needed, mock Synth as well, depending on what is used
  };
});

vi.mock('axios');

describe('ChordFinder Component', () => {
  test('detects chord when notes are selected', async () => {
    const { container } = render(<ChordFinder />);

    const fretCells = container.querySelectorAll('div[style*="cursor: pointer"]');
    // Select a fret to produce a note
    fireEvent.click(fretCells[1]);

    const chordDisplay = await screen.findByText(/Note:/i);
    expect(chordDisplay).toHaveTextContent(/F/i);
  });

  test('sends a message and displays bot response', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'This is a bot response' },
    });

    render(<ChordFinder />);

    const input = screen.getByPlaceholderText(/Message Chord Assist/i);
    const sendButton = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'What is a C chord?' } });
    fireEvent.click(sendButton);

    const userMessage = await screen.findByText(/What is a C chord\?/i);
    const botMessage = await screen.findByText(/This is a bot response/i);

    expect(userMessage).toBeInTheDocument();
    expect(botMessage).toBeInTheDocument();
  });

  test('plays a chord using Tone.js', async () => {
    const { container } = render(<ChordFinder />);

    // Select multiple notes to form a chord
    const fretCells = container.querySelectorAll('div[style*="cursor: pointer"]');
    fireEvent.click(fretCells[0]);
    fireEvent.click(fretCells[1]);

    const playButton = screen.getByRole('button', { name: /play chord/i });
    await userEvent.click(playButton);

    // Import the mocked Tone
    const Tone = await import('tone');
    expect(Tone.start).toHaveBeenCalled();
    // Also check that PolySynth was created and triggerAttackRelease was called if you want
    expect(Tone.PolySynth).toHaveBeenCalled();
  });
});
