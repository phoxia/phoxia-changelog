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

test("built pages contain deployable Lux and metadata assets", async ({ page }) => {
  await page.goto("/");
  const urls = await page.locator("img, link[rel='icon'], link[rel='manifest'], link[rel='apple-touch-icon']").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("src") ?? node.getAttribute("href")));
  expect(urls).not.toContainEqual(expect.stringMatching(/^file:/));
  await expect(page.locator("img").first()).toHaveJSProperty("complete", true);
  expect(await page.locator("img").first().evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});

test("single-release catalog has no inert search or invented metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.locator("body")).not.toContainText(/stable|verified/i);
  await expect(page.getByText("Phoxia DevKit", { exact: true })).toBeVisible();
});

test("theme supports system, light and dark and persists the choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: "Theme" }).click();
  await expect(page.getByRole("button", { name: "System" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate(() => localStorage.getItem("phoxia-changelog-theme"))).toBe("light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("button", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("stored theme is applied by a head script before the app mounts", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("phoxia-changelog-theme", "light"));
  await page.goto("/");

  expect(await page.locator("head script").evaluateAll((scripts) =>
    scripts.some((script) => script.textContent?.includes("phoxia-changelog-theme"))
  )).toBe(true);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("theme still works when local storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "SecurityError");
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Theme" }).click();
  await page.getByRole("button", { name: "Light" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
