import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      siyuan: resolve(__dirname, "./test/mocks/siyuan.ts"),
    },
  },
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setupTests.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
