import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import axios from 'axios';
import ChordFinder from '../components/ChordFinder';
import userEvent from '@testing-library/user-event';
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
