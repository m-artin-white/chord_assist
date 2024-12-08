import React from 'react';
import { vi, describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
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
