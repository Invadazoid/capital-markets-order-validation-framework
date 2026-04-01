import { test, expect } from "@playwright/test";

test("place order shows status message", async ({ page }) => {
  await page.goto("/");

  // Fill the order form
  await page.locator("#symbol").fill("ABC");
  await page.locator("#qty").fill("10");
  await page.locator("#side").selectOption("BUY");

  // Submit the order
  await page.locator("#placeOrderBtn").click();

  // Assert that the status message contains ACCEPTED
  const status = page.locator("#statusMessage");
  await expect(status).toContainText("ACCEPTED", { timeout: 10000 });
});

test("order appears in recent orders table after placement", async ({ page }) => {
  await page.goto("/");

  await page.locator("#symbol").fill("XYZ");
  await page.locator("#qty").fill("50");
  await page.locator("#side").selectOption("SELL");
  await page.locator("#placeOrderBtn").click();

  // Wait for status confirmation
  const status = page.locator("#statusMessage");
  await expect(status).toContainText("ACCEPTED", { timeout: 10000 });

  // Verify the order appears in the recent orders table
  const table = page.locator("table");
  await expect(table).toBeVisible();
  await expect(table.locator("td")).toContainText(["XYZ"]);
});

test("multiple orders appear in recent orders list", async ({ page }) => {
  await page.goto("/");

  // Place first order
  await page.locator("#symbol").fill("AAA");
  await page.locator("#qty").fill("5");
  await page.locator("#placeOrderBtn").click();
  await expect(page.locator("#statusMessage")).toContainText("ACCEPTED", { timeout: 10000 });

  // Place second order
  await page.locator("#symbol").fill("BBB");
  await page.locator("#qty").fill("20");
  await page.locator("#placeOrderBtn").click();
  await expect(page.locator("#statusMessage")).toContainText("ACCEPTED", { timeout: 10000 });

  // Both orders should appear in the table (newest first)
  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(2);
});
