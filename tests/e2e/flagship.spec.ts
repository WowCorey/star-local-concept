import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("flagship Thursday journey completes and resets", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Good evening, Alex" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm visit" }).click();
  await expect(page.getByText("Visit confirmed", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Visit" }).click();
  await page.getByRole("link", { name: "Choose table" }).click();
  await page.getByRole("button", { name: /Table 23, 4 to 6 people/ }).click();
  await page.getByRole("button", { name: "Use Table 23" }).click();

  await page.getByRole("link", { name: "Ride" }).click();
  await page.getByRole("button", { name: "Confirm ride windows" }).click();
  await expect(page.getByText("Booked in demo")).toBeVisible();

  await page.getByRole("link", { name: "Visit" }).click();
  await page.getByRole("button", { name: "Check in at Table 23" }).click();
  await expect(page.getByText("Checked in", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Order" }).click();
  await page.getByRole("button", { name: "Review Chicken parmigiana" }).click();
  await page.getByRole("button", { name: /Use my usual/ }).click();
  await expect(page.getByText(/Barbecue base, chips and salad, no dressing/)).toBeVisible();
  await page.getByRole("button", { name: "Confirm food order" }).click();
  await expect(page.getByText("Order confirmed", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Visit" }).click();
  await page.getByRole("button", { name: "Request the Cowboys game" }).click();
  await expect(page.getByText(/Request sent.*venue staff controls approval/)).toBeVisible();

  await page.getByRole("link", { name: "Rewards" }).click();
  await expect(page.getByText("DEMO-10482")).toBeVisible();
  await expect(page.getByText("17", { exact: true }).first()).toBeVisible();

  await page.getByRole("link", { name: "Me", exact: true }).click();
  await page.getByRole("button", { name: "Edit" }).first().click();
  await page
    .getByRole("textbox", { name: "Edit remembered value" })
    .fill("Harbour Family Hotel - Thursday evenings");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Harbour Family Hotel - Thursday evenings")).toBeVisible();

  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.getByRole("link", { name: "Home" }).click();
  await expect(page.getByRole("heading", { name: "Good evening, Alex" })).toBeVisible();
});

test("presenter can switch persona and venue", async ({ page }) => {
  await page.getByRole("button", { name: "Demo Controls", exact: true }).click();
  await page.getByRole("button", { name: /Accessibility/ }).click();
  await expect(page.getByRole("heading", { name: "Good evening, Taylor" })).toBeVisible();
  await expect(
    page
      .getByRole("main")
      .getByText(/Hinterland Local/)
      .first(),
  ).toBeVisible();
});

test("major controls are keyboard reachable and no customer gaming data is exposed", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.getByRole("link", { name: "Me", exact: true }).click();
  await expect(page.getByText("Never used for recommendations")).toBeVisible();
  await expect(
    page.getByText("This prototype contains no records from any of these categories."),
  ).toBeVisible();
});

test("primary routes have no horizontal overflow or console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const route of ["/", "/visit", "/visit/floor-plan", "/order", "/ride", "/rewards", "/me"]) {
    await page.goto(`./#${route}`);
    await expect(page.getByRole("main")).toBeVisible();
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${route} should fit the viewport`).toBe(false);
  }

  expect(errors).toEqual([]);
});
