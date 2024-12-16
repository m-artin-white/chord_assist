// Importing necessary modules and components for testing

// React is a JavaScript library for building user interfaces. 
// It is imported here to enable the rendering and testing of React components in the test environment.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from 'react';

// Functions from the `vitest` library, a lightweight and fast testing framework:
// - `vi` is used for creating mocks and spies during tests.
// - `describe` groups related test cases for better organization.
// - `test` defines individual test cases for evaluating specific functionality.
// - `expect` is used for writing assertions about component behavior and outputs.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect } from 'vitest';

// Utilities from the `@testing-library/react` library are used to test React components:
// - `render` is used to render a React component in the test environment.
// - `screen` provides utilities to query rendered elements.
// - `fireEvent` is used to simulate low-level user interactions, such as clicks or keypresses.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, screen, fireEvent } from '@testing-library/react';

// `BrowserRouter` from `react-router-dom` wraps the `NavBar` component to provide routing context.
// This is required for testing components that depend on React Router for navigation.
// Documentation: https://reactrouter.com/en/main/components/browser-router
import { BrowserRouter } from 'react-router-dom';

// Importing the `NavBar` component for testing.
// This component represents the navigation bar of the application and typically contains links for routing.
import NavBar from '../components/NavBar';


describe('NavBar', () => {
  test('renders all navigation links correctly', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    // Verify that all navigation links are rendered
    expect(screen.getByText(/Chord Finder/i)).toBeInTheDocument();
    expect(screen.getByText(/Chord Diagrams/i)).toBeInTheDocument();
    expect(screen.getByText(/Chord Progressions/i)).toBeInTheDocument();
    expect(screen.getByText(/Resources/i)).toBeInTheDocument();
  });

  test('navigation links have correct paths', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    // Verify that navigation links point to the correct paths
    expect(screen.getByText(/Chord Finder/i)).toHaveAttribute('href', '/');
    expect(screen.getByText(/Chord Diagrams/i)).toHaveAttribute('href', '/chords');
    expect(screen.getByText(/Chord Progressions/i)).toHaveAttribute('href', '/progressions');
    expect(screen.getByText(/Resources/i)).toHaveAttribute('href', '/resources');
  });


  test('renders the brand name correctly', () => {
    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    // Verify that the brand name is rendered correctly
    expect(screen.getByText(/Chord Assist/i)).toBeInTheDocument();
  });
});
