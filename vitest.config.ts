import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      siyuan: resolve(__dirname, "./test/mocks/siyuan.ts"),
    },
  },
  plugins: [svelte({ hot: !process.env.VITEST }), svelteTesting()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setupTests.ts"],
  },
});
