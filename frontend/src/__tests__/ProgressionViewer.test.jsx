import React from "react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProgressionViewer from "../components/ProgressionViewer";
import { Key, Progression } from "@tonaljs/tonal";

// Mocking tonal.js dependencies to isolate the component for testing
vi.mock("@tonaljs/tonal", () => ({
  Key: {
    majorKey: vi.fn(), // Mocking the `majorKey` function
  },
  Progression: {
    fromRomanNumerals: vi.fn(), // Mocking the `fromRomanNumerals` function
  },
}));

// Grouping tests for the ProgressionViewer component
describe("ProgressionViewer", () => {
  
  // Resetting all mocked functions before each test to avoid cross-test interference
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test to verify that the input field and button are rendered
  test("renders the input field and button", () => {
    render(<ProgressionViewer />); // Render the ProgressionViewer component

    // Check that the input field with the correct label is in the document
    expect(screen.getByLabelText(/enter chord/i)).toBeInTheDocument();
    
    // Check that the input field with the placeholder text is in the document
    expect(screen.getByPlaceholderText(/e.g., c, d#, bb/i)).toBeInTheDocument();
    
    // Check that the button with the correct role and name is in the document
    expect(
      screen.getByRole("button", { name: /generate progressions/i })
    ).toBeInTheDocument();
  });

  // Test to verify that the input field value updates when the user types
  test("updates the chord input value when typed", () => {
    render(<ProgressionViewer />); // Render the ProgressionViewer component

    // Find the input field using the placeholder text
    const input = screen.getByPlaceholderText(/e.g., c, d#, bb/i);
    
    // Simulate a user typing "G" into the input field
    fireEvent.change(input, { target: { value: "G" } });

    // Assert that the input field's value has been updated to "G"
    expect(input).toHaveValue("G");
  });
});

