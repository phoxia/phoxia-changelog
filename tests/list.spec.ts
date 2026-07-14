import { expect, test } from "@playwright/test";

test("global list links to Kit release", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Phoxia • Changelog");
  await expect(page.getByRole("link", { name: /1.0.0/ })).toHaveAttribute("href", "/kit/releases/1.0.0");
});

test("Kit list contains no invented product", async ({ page }) => {
  await page.goto("/kit");
  await expect(page.locator("body")).not.toContainText("Example product");
});
