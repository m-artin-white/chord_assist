import React from "react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ProgressionViewer from "../components/ProgressionViewer";
import { Key, Progression } from "@tonaljs/tonal";

// Mock tonal.js dependencies
vi.mock("@tonaljs/tonal", () => ({
  Key: {
    majorKey: vi.fn(),
  },
  Progression: {
    fromRomanNumerals: vi.fn(),
  },
}));

describe("ProgressionViewer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the input field and button", () => {
    render(<ProgressionViewer />);

    expect(screen.getByLabelText(/enter chord/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., c, d#, bb/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate progressions/i })
    ).toBeInTheDocument();
  });

  test("updates the chord input value when typed", () => {
    render(<ProgressionViewer />);

    const input = screen.getByPlaceholderText(/e.g., c, d#, bb/i);
    fireEvent.change(input, { target: { value: "G" } });

    expect(input).toHaveValue("G");
  });
});
