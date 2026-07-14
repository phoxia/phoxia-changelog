import { expect, test } from "@playwright/test";

test("detail shows verified metadata without an invented RFC", async ({ page }) => {
  await page.goto("/kit/releases/1.0.0");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("1.0.0");
  await expect(page.getByRole("link", { name: "Documentation" })).toHaveAttribute("href", "https://docs.phoxia.org/kit/1.0.0");
  await expect(page.getByRole("link", { name: "Release tag" })).toHaveAttribute("href", "https://github.com/phoxia/phoxia-devkit/releases/tag/v1.0.0");
  await expect(page.locator("body")).not.toContainText(/RFC \d/i);
});

test("unknown release returns not found", async ({ request }) => {
  expect((await request.get("/kit/releases/99.0.0")).status()).toBe(404);
});

test("pt-BR path renders translated release content", async ({ page }) => {
  await page.goto("/pt-BR/kit/releases/1.0.0");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("1.0.0");
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Documentacao" })).toHaveAttribute("href", "https://docs.phoxia.org/kit/1.0.0");
  await expect(page.getByRole("link", { name: "Tag da release" })).toHaveAttribute("href", "https://github.com/phoxia/phoxia-devkit/releases/tag/v1.0.0");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Todos os produtos" })).toHaveAttribute("href", "/pt-BR");
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Kit" })).toHaveAttribute("href", "/pt-BR/kit");
});
