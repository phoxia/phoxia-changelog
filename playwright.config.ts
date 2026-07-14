import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  webServer: { command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4175", port: 4175 },
  use: { baseURL: "http://127.0.0.1:4175" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1200 } } },
    { name: "tablet", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } }
  ]
});
