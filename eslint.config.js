import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    files: ["src/**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  {
    files: ["src/**/*.{js,ts}"],
    rules: {
      "vue/one-component-per-file": "off",
    },
  },
  {
    files: ["src/**/*.{js,ts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": "off",
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
