import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import App from '../App';
import React from 'react';

describe('App Routing', () => {
  test('renders ChordFinder on default route', async () => {
    // Set the current route to '/'
    window.history.pushState({}, '', '/');
    render(<App />);
    // use findByText if asynchronous rendering might occur
    expect(await screen.findByText(/Welcome! I am The String Sage/i)).toBeInTheDocument();
  });

  test('renders ChordViewer on /chords route', async () => {
    // Set the current route to '/chords'
    window.history.pushState({}, '', '/chords');
    render(<App />);
    // Adjust this text to whatever ChordViewer actually renders
    expect(await screen.findByText(/Selected Note/i)).toBeInTheDocument();
  });
});
