import path from "path";
import fs from "fs";

const iconPaths = [
  "./node_modules/siyuan-app/app/appearance/icons/ant/icon.js",
  "./node_modules/siyuan-app/app/appearance/icons/material/icon.js",
];

// Regular expression to match all id attributes within <symbol> tags
const idRegex = /<symbol id="([^"]+)" viewBox="[^"]+">/g;
const ids = [];

iconPaths.forEach((filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
});

// Create a string union type
const unionType = `export type SiYuanIcon = ${ids.map((id) => `"${id}"`).join(" | ")};`;

// Path to the output TypeScript file
const outputFilePath = path.resolve("./src/types/SiyuanIcon.ts");

// Write the union type to the TypeScript file
fs.writeFileSync(outputFilePath, unionType, "utf-8");

console.log("IconId type generated successfully.");
