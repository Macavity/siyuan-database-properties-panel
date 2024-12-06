import path, { resolve } from "path";
import { defineConfig } from "vitest/config";
import minimist from "minimist";
import { viteStaticCopy } from "vite-plugin-static-copy";
import livereload from "rollup-plugin-livereload";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import zipPack from "vite-plugin-zip-pack";
import fg from "fast-glob";
import fs from "fs";

import vitePluginYamlI18n from "./yaml-plugin";

const args = minimist(process.argv.slice(2));
const isWatch = args.watch || args.w || false;
const devDistDir = "dev";
const isProdBuild = process.env.NODE_ENV === "production";
const distDir = isProdBuild ? "dist" : devDistDir;

function getPluginVersion(): string {
  const pluginJsonPath = path.resolve(__dirname, "plugin.json");
  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, "utf-8"));
  return pluginJson.version;
}

console.log("isProdBuild:    ", isProdBuild);
console.log("isWatch:        ", isWatch);
console.log("distDir:        ", distDir);
console.log("NODE_ENV:       ", process.env.NODE_ENV);
console.log("PLUGIN_VERSION: ", getPluginVersion());

let plugins = [];

if (isWatch) {
  plugins = [
    livereload(devDistDir),
    {
      //监听静态资源文件
      name: "watch-external",
      async buildStart() {
        const files = await fg([
          "public/i18n/**",
          "./README*.md",
          "./plugin.json",
        ]);
        for (const file of files) {
          this.addWatchFile(file);
        }
      },
    },
  ];
}

if (isProdBuild) {
  plugins = [
    zipPack({
      inDir: "./dist",
      outDir: "./",
      outFileName: "package.zip",
    }),
  ];
}

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@siyuan/app": resolve(__dirname, "node_modules/siyuan-app/app/src"),
    },
  },

  plugins: [
    svelte(),

    vitePluginYamlI18n({
      inDir: "public/i18n",
      outDir: `${distDir}/i18n`,
    }),

    viteStaticCopy({
      targets: [
        {
          src: "./README*.md",
          dest: "./",
        },
        {
          src: "./plugin.json",
          dest: "./",
        },
        {
          src: "./preview.png",
          dest: "./",
        },
        {
          src: "./icon.png",
          dest: "./",
        },
      ],
    }),
  ],

  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  define: {
    "process.env.DEV_MODE": `"${isWatch}"`,
    "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
    "process.env.PLUGIN_VERSION": JSON.stringify(getPluginVersion()),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },

  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,

    // 构建后是否生成 source map 文件
    sourcemap: !isProdBuild ? "inline" : true,

    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: isProdBuild,

    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs"],
    },
    rollupOptions: {
      plugins,

      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["siyuan", "process", "electron"],

      output: {
        entryFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "index.css";
          }
          return assetInfo.name;
        },
      },
    },
  },
});
