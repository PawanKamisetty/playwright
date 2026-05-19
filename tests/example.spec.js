const { test, expect } = require("../fixtures/testSetup");
const path = require("path");
const fs = require("fs");

test.skip("dashboard loads after login", async ({ loggedInPage }) => {
  await expect(loggedInPage.welcomeMessage).toHaveText("Swag Labs");
});

// Fulfill
test.skip("mocks a fruit and doesn't call api", async ({ page }) => {
  // Mock the api call before navigating
  await page.route("*/**/api/v1/fruits", async (route) => {
    const json = [{ name: "Strawberry", id: 21 }];
    await route.fulfill({ json });
  });
  // Go to the page
  await page.goto("https://demo.playwright.dev/api-mocking");

  // Assert that the Strawberry fruit is visible
  await expect(page.getByText("Strawberry")).toBeVisible();
});

test.skip("mocks api", async ({ page }) => {
  // Mock the api call before navigating
  await page.route("*/**/api/v1/fruits", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, name: "Pawan" },
        { id: 2, name: "Rahul" },
      ]),
    });
  });
  // Go to the page
  await page.goto("https://demo.playwright.dev/api-mocking");

  // Assert that the Strawberry fruit is visible
  await expect(page.getByText("Pawan")).toBeVisible();
});

//Modify
test.skip("gets the json from api and adds a new fruit", async ({ page }) => {
  await page.route("*/**/api/v1/fruits", async (route) => {
    const response = await route.fetch();
    const json = await response.json();

    json.push({ name: "Fahhh", id: 100 });
    await route.fulfill({ response, json });
  });

  await page.goto("https://demo.playwright.dev/api-mocking");

  await expect(page.getByText("Fahhh")).toBeVisible();
});

test.skip("Har file Record", async ({ page }) => {
  await page.routeFromHAR("./har/api.har", {
    update: true,
  });

  await page.goto("https://demo.playwright.dev");

  await page.context().close();
});

test.skip("Har file Replay", async ({ page }) => {
  //abort helps verify replay is actually using HAR. If requests not found in har file then
  //this test will fails instead of silently going to the real website
  await page.routeFromHAR("./har/api.har", {
    notFound: "abort",
  });

  await page.goto("https://demo.playwright.dev");
});

test.skip("API Testing - GET", async ({ request }) => {
  const response = await request.get("https://reqres.in/api/users/2", {
    headers: {
      "x-api-key": process.env.RESREQ_API_KEY,
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.data.first_name).toBe("Janet");
});

test.skip("should create a bug report", async ({ request }) => {
  const newIssue = await request.post(
    `/repos/${process.env.GITHUB_USERNAME}/${process.env.REPO}/issues`,
    {
      data: {
        title: "[Bug] report 1",
        body: "Bug description",
      },
    },
  );

  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(
    `/repos/${process.env.GITHUB_USERNAME}/${process.env.REPO}/issues`,
  );
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(
    expect.objectContaining({
      title: "[Bug] report 1",
      body: "Bug description",
    }),
  );
});

test.skip("should create a feature request", async ({ request }) => {
  const newIssue = await request.post(
    `/repos/${process.env.GITHUB_USERNAME}/${process.env.REPO}/issues`,
    {
      data: {
        title: "[Feature] request 1",
        body: "Feature description",
      },
    },
  );

  expect(newIssue.ok()).toBeTruthy();

  const issues = await request.get(
    `/repos/${process.env.GITHUB_USERNAME}/${process.env.REPO}/issues`,
  );
  expect(issues.ok()).toBeTruthy();
  expect(await issues.json()).toContainEqual(
    expect.objectContaining({
      title: "[Feature] request 1",
      body: "Feature description",
    }),
  );
});

// test.beforeAll(async ({ request }) => {

//   // Create a new repository
//   const response = await request.post('/user/repos', {
//     data: {
//       name: process.env.REPO
//     }
//   });
//   expect(response.ok()).toBeTruthy();
// });

// test.afterAll(async ({ request }) => {
//   // Delete the repository
//   const response = await request.delete(`/repos/${process.env.GITHUB_USERNAME}/${process.env.REPO}`);
//   expect(response.ok()).toBeTruthy();
// });

test.skip("waitForResponse with api key", async ({ page }) => {
  await page.goto("https://reqres.in");

  // Start waiting for response
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/users/2") && response.status() === 200,
  );

  // Trigger API request
  await page.evaluate(async (apiKey) => {
    await fetch("https://reqres.in/api/users/2", {
      headers: {
        "x-api-key": apiKey,
      },
    });
  }, process.env.RESREQ_API_KEY);

  // Wait for response
  const response = await responsePromise;

  // Convert to JSON
  const body = await response.json();

  console.log(body);

  expect(body.data.first_name).toBe("Janet");
});

test.skip("iframe test", async ({ page }) => {
  await page.goto(
    "https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe",
  );

  // Switch into iframe
  const iframe = page.frameLocator('iframe[title="W3Schools HTML Tutorial"]');

  // Click JAVA link inside iframe
  await iframe.getByRole("link", { name: "JAVA" }).click();
});

//WAITS
test.describe.skip("Waits", () => {
  test("expect().toBeVisible()", async ({ page }) => {
    await page.goto("https://jsonplaceholder.typicode.com");
    await expect(page.locator("h1").first()).toHaveText("JSONPlaceholder");
  });

  test("waitForSelector — wait for element in DOM", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/dynamic_loading/1");

    // Click the start button — content loads dynamically
    await page.click("#start button");

    // Wait until #finish appears in the DOM (not just visible)

    // await expect(page.locator('#loading')).not.toBeHidden();
    await page.waitForSelector("#finish", { state: "visible" });

    // State options for waitForSelector:
    // 'attached'  — element exists in DOM (may be hidden)
    // 'detached'  — element removed from DOM
    // 'visible'   — element is visible and has size
    // 'hidden'    — element is hidden or removed

    // Now assert
    await expect(page.locator("#finish h4")).toHaveText("Hello World!");
  });

  test("waitForLoadState()", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Wait until network becomes quiet
    await page.waitForLoadState("networkidle");

    // Verify search box visible
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("waitFor()", async ({ page }) => {
    await page.goto("https://playwright.dev/");

    // Wait for Sign in button to appear
    await page.getByRole("link", { name: "Get Started" }).waitFor();

    // Verify visible
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });
});

test.describe.skip("IFRAME", () => {
  test("interact with element inside an iframe", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/iframe");

    // Step 1: switch into iframe
    const iframe = page.frameLocator("#mce_0_ifr");

    const closeButton = await page.getByRole("button", { name: "Close" });
    if (await closeButton.isVisible().catch(() => false)) {
      await closeButton.click();
    }

    // Step 2: locate element inside iframe
    const editor = iframe.locator("#tinymce");

    // Clear existing text
    await editor.click();

    // Validation
    await expect(editor).toHaveText("Your content goes here.");
  });

  // =====================================================
  // 2. Different ways to locate iframes
  // =====================================================

  test.skip("different ways to select an iframe", async ({ page }) => {
    await page.goto("/");

    // By CSS selector
    const f1 = page.frameLocator("iframe#payment-frame");

    // By name attribute
    const f2 = page.frameLocator('iframe[name="frame-left"]');

    // By title attribute
    const f3 = page.frameLocator('iframe[title="Payment Form"]');

    // By partial src match
    const f4 = page.frameLocator('iframe[src*="stripe.com"]');

    // By index
    const f5 = page.frameLocator("iframe").nth(0);

    // Interact inside iframe
    await f1.locator("#card-number").fill("4242424242424242");

    await f1.locator("#expiry").fill("12/26");

    await f1.locator("#cvv").fill("123");
  });

  // =====================================================
  // 3. Nested iframes
  // =====================================================

  test("act inside a nested iframe", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/nested_frames");

    const topFrame = page.frameLocator('frame[name="frame-top"]');

    // Left iframe
    const leftFrame = topFrame.frameLocator('frame[name="frame-left"]');

    // Right iframe
    const rightFrame = topFrame.frameLocator('frame[name="frame-right"]');

    // Interact inside nested iframe
    await expect(leftFrame.locator("body")).toHaveText("LEFT");
  });

  // =====================================================
  // 4. Real-world Stripe payment iframe
  // =====================================================

  test("Stripe iframe payment example", async ({ page }) => {
    await page.goto("https://checkout.stripe.dev/preview");

    // Locate Stripe iframe
    const stripeFrame = page.frameLocator('iframe[src*="js.stripe.com"]');

    // Fill card number
    await stripeFrame.locator("#cardNumber").click().fill("4242424242424242");

    // Fill expiry
    await stripeFrame.locator("#cardExpiry").click().fill("12 / 30");

    // Fill CVC
    await stripeFrame.locator("#cardCvc").click().fill("123");

    // Submit payment
    await page.getByRole("button", { name: "submit" }).click();
  });
});

test.describe.skip("Files", () => {
  test("upload a single file", async ({ page }) => {
    // File path in current project directory
    const filePath = path.join(__dirname, "./test-files/sample.txt");

    // Create file
    fs.writeFileSync(filePath, "Hello from Playwright file upload!");

    await page.goto("https://the-internet.herokuapp.com/upload");

    // Locate the file input element
    const fileInput = page.locator("#file-upload");
    // Set the file — no OS dialog! Works fully headless
    await fileInput.setInputFiles(filePath);
    // Submit the upload
    await page.click("#file-submit");
    // Assert upload was successful
    await expect(page.locator("#uploaded-files")).toHaveText("sample.txt");
  });

  test("upload multiple files at once", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/upload");

    const folderPath = path.join(__dirname, "../test-files");

    const filePath1 = path.join(folderPath, "file1.txt");
    const filePath2 = path.join(folderPath, "file2.txt");
    const filePath3 = path.join(folderPath, "file3.txt");

    // Create file
    fs.writeFileSync(filePath1, "Hello from Playwright file upload 1!");
    fs.writeFileSync(filePath2, "Hello from Playwright file upload 3!");
    fs.writeFileSync(filePath3, "Hello from Playwright file upload 3!");

    await page
      .locator("#file-upload")
      .setInputFiles([filePath1, filePath2, filePath3]);
    await page.click("#file-submit");
    // Each uploaded file should appear in the list
    await expect(page.locator("#uploaded-files")).toContainText("file1.txt");
    await expect(page.locator("#uploaded-files")).toContainText("file2.txt");
    await expect(page.locator("#uploaded-files")).toContainText("file3.txt");
  });

  test("upload a file created in memory — no disk file needed!", async ({
    page,
  }) => {
    await page.goto("https://the-internet.herokuapp.com/upload");

    // Create a virtual file with custom name, mime type and content
    await page.locator("#file-upload").setInputFiles({
      name: "report.csv",
      mimeType: "text/csv",
      buffer: Buffer.from("name,score\nAlice,95\nBob,87\nCharlie,72"),
    });
    await page.click("#file-submit");
    await expect(page.locator("#uploaded-files")).toHaveText("report.csv");
  });

  test("upload a JSON config file created in memory", async ({ page }) => {
    await page.goto("/settings");
    const config = { theme: "dark", language: "en", notifications: true };
    await page.locator('[data-test="config-upload"]').setInputFiles({
      name: "config.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(config)),
    });
    await expect(page.locator(".upload-success")).toBeVisible();
  });

  test("download file", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/download");

    // Wait for download event
    const downloadPromise = page.waitForEvent("download");
    // Click file link
    await page.getByText("sample.txt").click();
    // await page.locator("a").first().click();

    // Get download object
    const download = await downloadPromise;

    // Save file locally, suggestedFilename gets original filename suggested by browser/server so that there's no repition everytime.
    await download.saveAs("./test-files/" + download.suggestedFilename());
  });
});

test.describe("Dialogs", () => {
  test("accept an alert dialog", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    // ✅ Set up BEFORE the action that triggers the dialog
    page.on("dialog", async (dialog) => {
      console.log("Dialog type:", dialog.type()); // 'alert'

      console.log("Dialog message:", dialog.message()); // 'I am a JS Alert'

      await dialog.accept(); // click OK
    });
    await page.click('button[onclick="jsAlert()"]');
    await expect(page.locator("#result")).toHaveText(
      "You successfully clicked an alert",
    );
  });

  test("accept a confirm dialog (click OK)", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    page.on("dialog", async (dialog) => {
      await dialog.accept(); // click OK / Yes
    });
    await page.click('button[onclick="jsConfirm()"]');
    await expect(page.locator("#result")).toHaveText("You clicked: Ok");
  });

  test("dismiss a confirm dialog (click Cancel)", async ({ page }) => {
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    page.on("dialog", async (dialog) => {
      await dialog.dismiss(); // click Cancel / No
    });
    await page.click('button[onclick="jsConfirm()"]');
    await expect(page.locator("#result")).toHaveText("You clicked: Cancel");
  });

  test("accept a prompt dialog with text enetred (click ok)", async ({
    page,
  }) => {
    const name = "Virat Kohli";
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts");
    page.on("dialog", async (dialog) => {
      await dialog.accept(name); // click Cancel / No
    });
    await page.click('button[onclick="jsPrompt()"]');
    await expect(page.locator("#result")).toHaveText("You entered: " + name);
  });
});
