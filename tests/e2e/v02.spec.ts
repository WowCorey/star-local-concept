import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("Alex chooses Bistro and Table 23", async ({ page }) => {
  await page.goto("./#/visit/zones");
  await page.getByRole("radio", { name: /Bistro/ }).click();
  await page.getByRole("button", { name: "Choose a Bistro table" }).click();
  await page.getByRole("button", { name: /Table 23,/ }).click();
  await page.getByRole("button", { name: "Use Table 23" }).click();
  await expect(page.getByRole("heading", { name: "Table 23 · Bistro" })).toBeVisible();
});

test("Alex switches to Sports Bar and sees different tables and screens", async ({ page }) => {
  await page.goto("./#/visit/zones");
  await page.getByRole("radio", { name: /Sports Bar/ }).click();
  await page.getByRole("button", { name: "Choose a Sports Bar table" }).click();
  await expect(page.getByRole("button", { name: /Table S12,/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Table S14,/ })).toBeVisible();
  await page.getByRole("link", { name: "Watch Tonight" }).click();
  await expect(page.getByRole("heading", { name: "Sports Bar Main Wall" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Screen 7" })).toHaveCount(0);
});

test("Alex orders food and a controlled drink", async ({ page }) => {
  await page.goto("./#/order/food");
  await page.getByRole("button", { name: "Review Chicken parmigiana" }).click();
  await page.getByRole("button", { name: /Use my usual/ }).click();
  await page.getByRole("button", { name: "Confirm food order" }).click();
  await expect(page.getByText("Order confirmed", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Drinks" }).click();
  await page.getByRole("button", { name: "Review House Draught Lager" }).click();
  await page.getByRole("button", { name: /Schooner.*8\.90/ }).click();
  await page.getByRole("button", { name: "Add to my order" }).click();
  await page.getByRole("button", { name: "Submit for review" }).click();
  await expect(page.getByText("Staff confirmation required.")).toBeVisible();
});

test("Alex creates a participant-controlled group round", async ({ page }) => {
  await page.goto("./#/order/group");
  await page.getByLabel("Item for Jordan").selectOption("harbour-zero-lager");
  await page
    .getByRole("article")
    .filter({ hasText: "Jordan" })
    .getByRole("button", { name: "Accept" })
    .click();
  await expect(
    page.getByRole("article").filter({ hasText: "Jordan" }).getByText("accepted", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Add water for everyone/ }).click();
});

test("Alex requests Screen 7", async ({ page }) => {
  await page.goto("./#/visit/watch");
  await page.getByRole("button", { name: "Request Cowboys vs Broncos" }).click();
  await expect(page.getByRole("button", { name: "Request joined" })).toBeVisible();
});

test("Alex activates and pauses phone audio", async ({ page }) => {
  await page.goto("./#/visit/watch");
  await page.getByRole("button", { name: "Listen on phone" }).click();
  await expect(page.getByText("Listening to Screen 7")).toBeVisible();
  await page.getByRole("button", { name: "Pause phone audio" }).click();
  await expect(page.getByText("paused", { exact: true })).toBeVisible();
});

test("Alex creates and completes a Table Service request", async ({ page }) => {
  await page.goto("./#/visit");
  await page.getByRole("button", { name: "Check in at Table 23" }).click();
  await page.getByRole("button", { name: "Table Service" }).click();
  await page.getByRole("button", { name: /Sauce.*Bistro Team/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Table Service" }).getByText("Bistro Team", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Advance response" }).click();
  await page.getByRole("button", { name: "Advance response" }).click();
  await page.getByRole("button", { name: "Advance response" }).click();
  await expect(
    page.getByRole("dialog", { name: "Table Service" }).getByText("Completed", { exact: true }),
  ).toBeVisible();
});

test("phone receptionist creates a booking and bus request", async ({ page }) => {
  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page.getByRole("button", { name: /Phone reception/ }).click();
  await expect(page.getByRole("dialog", { name: "AI telephone receptionist" })).toBeVisible();
  for (let index = 0; index < 5; index += 1)
    await page.getByRole("button", { name: /Continue call/ }).click();
  await expect(page.getByText("Visit plan created")).toBeVisible();
  await expect(page.getByText("Bistro Table 23")).toBeVisible();
});

test("Jordan completes the UFC venue journey", async ({ page }) => {
  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page.getByRole("button", { name: /Sports night/ }).click();
  await page.goto("./#/visit/watch");
  await expect(page.getByRole("heading", { name: "UFC main card" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Arena Screen 1" })).toBeVisible();
  await page.goto("./#/order/group");
  await expect(
    page.getByLabel("Item for Alex").getByRole("option", { name: /Stadium Tap Lager/ }),
  ).toHaveCount(1);
});

test("Taylor completes accessibility and bottle-shop collection", async ({ page }) => {
  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page.getByRole("button", { name: /^Accessibility$/ }).click();
  await page.goto("./#/visit/floor-plan");
  await expect(page.getByRole("button", { name: /Table 4,.*low table.*step-free/i })).toBeVisible();
  await page.goto("./#/order/collection");
  await page
    .getByRole("article")
    .filter({ hasText: "Hinterland Pale Six" })
    .getByRole("button", { name: "Select" })
    .click();
  await page.getByRole("button", { name: "Reserve item" }).click();
  await expect(page.getByText("LOCAL-482")).toBeVisible();
});

test("presentation mode completes its full sequence", async ({ page }) => {
  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Demo Controls v0.2" })
    .getByRole("button", { name: "Start presentation", exact: true })
    .click();
  await expect(page.getByLabel("Guided presentation mode")).toContainText("Step 1 of 16");
  for (let index = 0; index < 15; index += 1)
    await page.getByRole("button", { name: "Next presentation step" }).click();
  await expect(page.getByLabel("Guided presentation mode")).toContainText("Step 16 of 16");
  await expect(page.getByLabel("Guided presentation mode")).toContainText("Bottle-shop collection");
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Guided presentation mode")).toHaveCount(0);
});

test("public prototype QR link is present on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop presentation panel only");
  const link = page.getByRole("link", { name: /Open the prototype on your phone/ });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "https://wowcorey.github.io/star-local-concept/");
  await expect(link.locator("svg")).toHaveCount(1);
});

test("public-data safety boundaries remain visible", async ({ page }) => {
  await page.goto("./#/visit/zones");
  await expect(page.getByRole("radio", { name: /Regulated area/ })).toHaveCount(0);
  await page.goto("./#/me");
  await expect(page.getByText("Never used for recommendations")).toBeVisible();
  await expect(
    page.getByText("This prototype contains no records from any of these categories."),
  ).toBeVisible();
});

test("all v0.2 routes fit the mobile viewport", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile overflow audit");
  for (const route of [
    "/",
    "/visit",
    "/visit/zones",
    "/visit/floor-plan",
    "/visit/watch",
    "/order/food",
    "/order/drinks",
    "/order/group",
    "/order/status",
    "/order/collection",
    "/ride",
    "/rewards",
    "/me",
  ]) {
    await page.goto(`./#${route}`);
    await expect(page.getByRole("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      `${route} should not overflow`,
    ).toBe(true);
  }
});

test("v0.2 routes produce no unhandled console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "/",
    "/visit/zones",
    "/visit/floor-plan",
    "/visit/watch",
    "/order/food",
    "/order/drinks",
    "/order/group",
    "/order/status",
    "/order/collection",
    "/rewards",
  ]) {
    await page.goto(`./#${route}`);
    await expect(page.getByRole("main")).toBeVisible();
  }
  expect(errors).toEqual([]);
});
