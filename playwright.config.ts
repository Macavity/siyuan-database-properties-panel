import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:6808/stage/build/desktop/",
    // Reuse the existing SiYuan browser viewport
    viewport: { width: 1512, height: 800 },
  },
  // Only run in Chromium — SiYuan desktop uses Electron/Chromium
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
