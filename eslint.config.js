import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.svelte"],
    plugins: {
      svelte: eslintPluginSvelte,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    rules: {
      ...eslintPluginSvelte.configs.recommended.rules,
      // Disable specific a11y rules
      "svelte/a11y-click-events-have-key-events": "off",
      "svelte/a11y-missing-attribute": "off",
    },
  },
  {
    files: ["src/**/*.{js,ts,svelte}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    rules: {
      // Disable specific a11y rules
      "svelte/a11y-click-events-have-key-events": "off",
      "svelte/no-static-element-interactions": "off",
      "svelte/a11y-missing-attribute": "off",
    },
  },
  {
    ignores: [
      "src/**/*.test.ts",
      "src/**/*.test.js",
      "src/**/*.spec.ts",
      "src/**/*.spec.js",
      "src/libs/siyuan/**/*",
      "src/types/**/*.d.ts",
      "test/**",
      "vue/**",
      "scripts/**",
      "dev/**",
      "*.config.js",
      "*.config.ts",
      "yaml-plugin.js",
      "dist/**",
    ],
  },
];
