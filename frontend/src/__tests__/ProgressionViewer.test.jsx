// Importing necessary modules and components for testing

// React is a JavaScript library for building user interfaces. 
// It is imported here to enable the rendering and testing of React components in the test environment.
// Documentation: https://reactjs.org/docs/getting-started.html
import React from "react";

// Functions from the `vitest` library, a lightweight and fast testing framework:
// - `vi` is used for creating mocks and spies during tests.
// - `describe` groups related test cases for better organization.
// - `test` defines individual test cases to evaluate specific functionality.
// - `expect` is used for writing assertions about the behavior of the component.
// - `beforeEach` runs setup logic before each test case, ensuring consistent initial states.
// Documentation: https://vitest.dev/
import { vi, describe, test, expect, beforeEach } from "vitest";

// Utilities from the `@testing-library/react` library are used to test React components:
// - `render` is used to render a React component into the test environment.
// - `screen` provides query utilities to interact with rendered components.
// - `fireEvent` is used to simulate low-level user interactions, such as clicks or keypresses.
// Documentation: https://testing-library.com/docs/react-testing-library/intro/
import { render, screen, fireEvent } from "@testing-library/react";

// Importing the `ProgressionViewer` component for testing.
// This component is responsible for displaying and managing chord progressions in the application.
import ProgressionViewer from "../components/ProgressionViewer";

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

