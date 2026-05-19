// fixtures/testSetup.js
const { test: base, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const { LoginPage } = require('../pages/LoginPage');

exports.expect = expect;

exports.test = base.extend({

//   // ──────────────────────────────────────────
//   // Reuse worker auth state for all tests
//   // ──────────────────────────────────────────
//   storageState: async ({ workerStorageState }, use) => {
//     await use(workerStorageState);
//   },

//   // ──────────────────────────────────────────
//   // Worker-scoped authentication
//   // Runs ONCE per worker
//   // ──────────────────────────────────────────
//   workerStorageState: [async ({ browser }, use, testInfo) => {

//     // Unique worker id
//     const id = testInfo.parallelIndex;

//     // Auth file path
//     const fileName = path.resolve(
//       testInfo.project.outputDir,
//       `.auth/${id}.json`
//     );

//     // Reuse auth state if already exists
//     if (fs.existsSync(fileName)) {
//       await use(fileName);
//       return;
//     }

//     // Create clean page
//     const page = await browser.newPage({
//       storageState: undefined,
//     });

//     // Login using POM
//     const loginPage = new LoginPage(page);

//     await loginPage.goto();

//     await loginPage.login(
//       process.env.USERNAME,
//       process.env.PASSWORD
//     );

//     // Save authenticated state
//     await page.context().storageState({
//       path: fileName
//     });

//     await page.close();

//     // Pass auth file to tests
//     await use(fileName);

//   }, { scope: 'worker' }],

  // ──────────────────────────────────────────
  // Test-scoped fixture
  // Provides logged-in LoginPage object
  // ──────────────────────────────────────────
  loggedInPage: async ({ page }, use) => {

    const loginPage = new LoginPage(page);

    await page.goto('/');

    await use(loginPage);

  },

  // Example composed fixture
  // adminPage: async ({ loggedInPage }, use) => {
  //   await loggedInPage.escalateToAdmin();
  //   await use(loggedInPage);
  // },

});
