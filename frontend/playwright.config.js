import { defineConfig } from '@playwright/test';


export default defineConfig({
  // Directory where tests are located
  testDir: './tests/playwright',

  // Use the HTML reporter to see test results
  reporter: 'html',

  // Shared settings for all the projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    // This targets your running frontend application.
    baseURL: 'http://localhost:3000',

    // Capture trace on failure
    trace: 'on-first-retry',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
});