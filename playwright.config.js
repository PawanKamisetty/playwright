// @ts-check
import { defineConfig, devices } from '@playwright/test';
require('dotenv').config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // All requests we send go to this API endpoint.
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      'Accept': 'application/vnd.github.v3+json',
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      'Authorization': `token ${process.env.API_TOKEN}`,
    },

    // proxy: {
    //   server: 'http://my-proxy:8080',
    //   username: 'user',
    //   password: 'secret'
    // },
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [

    // { name: 'setup', testMatch: /.*\.setup\.js/ },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // dependencies: ['setup'],

    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  // outputDir: 'test-results',

  // path to the global setup files.
  // globalSetup: require.resolve('./global-setup'),

  // path to the global teardown files.
  // globalTeardown: require.resolve('./global-teardown'),

  // Each test is given 30 seconds.
  // timeout: 30000,

  // Glob patterns or regular expressions to ignore test files.
  // testIgnore: '*test-assets',

  // Glob patterns or regular expressions that match test files.
  // testMatch: '*todo-tests/*.spec.ts',

  // expect: {
  //   // Maximum time expect() should wait for the condition to be met.
  //   timeout: 5000,

  //   toHaveScreenshot: {
  //     // An acceptable amount of pixels that could be different, unset by default.
  //     maxDiffPixels: 10,
  //   },

  //   toMatchSnapshot: {
  //     // An acceptable ratio of pixels that are different to the
  //     // total amount of pixels, between 0 and 1.
  //     maxDiffPixelRatio: 0.1,
  //   },
  // },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

