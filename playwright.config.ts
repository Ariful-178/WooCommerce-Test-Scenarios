import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './src/env/env.config';

export default defineConfig({
  testDir: './src/tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: envConfig.getWorkers(),

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['list']
  ],

  use: {
    baseURL: envConfig.getBaseURL(),

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    actionTimeout: envConfig.getDefaultTimeout(),

    navigationTimeout: envConfig.getNavigationTimeout(),

    storageState: './auth/auth.json',
    headless: false,
    
  },

  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        storageState: { cookies: [], origins: [] }, // Empty state for setup
        headless: false, // Run auth setup in headed mode to avoid bot detection
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      dependencies: ['setup'],
    },

  ],

  outputDir: 'test-results/',
});
