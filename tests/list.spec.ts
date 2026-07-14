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
  await expect(page.locator("link[rel='manifest']")).toHaveCount(1);
  await expect(page.locator("img").first()).toHaveJSProperty("complete", true);
  expect(await page.locator("img").first().evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);

  const manifestUrl = await page.locator("link[rel='manifest']").getAttribute("href");
  expect(manifestUrl).not.toMatch(/^data:/);
  const response = await page.request.get(manifestUrl!);
  expect(response.ok()).toBe(true);
  const webManifest = await response.json();
  for (const icon of webManifest.icons) expect((await page.request.get(new URL(icon.src, response.url()).toString())).ok()).toBe(true);
});

test("localized list shells are prerendered with translations", async ({ page }) => {
  for (const path of ["/pt-BR", "/pt-BR/kit"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("status")).toHaveCount(0);
  }
});

test("localized release cards keep the pt-BR prefix", async ({ page }) => {
  await page.goto("/pt-BR/kit");
  await expect(page.getByRole("link", { name: /1.0.0/ }).first()).toHaveAttribute("href", "/pt-BR/kit/releases/1.0.0");
});

test("header brand keeps the current locale", async ({ page }) => {
  await page.goto("/pt-BR/kit");
  await expect(page.getByRole("link", { name: "Phoxia Changelog home" })).toHaveAttribute("href", "/pt-BR");
});

test("header controls meet the minimum pointer target size", async ({ page }) => {
  await page.goto("/");
  for (const target of await page.locator("header nav a, header nav button").all()) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }
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
