import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Enable `test` and `describe` as globals
    environment: 'jsdom', // Simulate a browser-like environment
    setupFiles: './vitest.setup.js', // Path to a setup file (optional)
  },
});