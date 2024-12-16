// Importing necessary modules and components for testing

// `render` and `screen` are utilities from the `@testing-library/react` library, 
// which is used for testing React components by simulating user interactions and verifying expected outputs.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, screen } from '@testing-library/react';

// Importing functions from the `vitest` library, which is a fast, lightweight testing framework.
// - `vi` is used to create mocks and spies for functions or modules.
// - `describe` groups related test cases for organizational purposes.
// - `test` defines an individual test case.
// - `expect` is used to write assertions about the behavior of the tested code.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect } from 'vitest';

// Importing the main React application component (`App`) for testing.
// This allows testing the rendering and behavior of the entire application.
import App from '../App';

// React is a JavaScript library for building user interfaces.
// It is imported here as a dependency for rendering React components in tests.
// Documentation: https://reactjs.org/docs/getting-started.html
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
