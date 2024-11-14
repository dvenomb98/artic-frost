import fs from "fs";
import path from "path";

const packageJsonPath = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../package.json"
);
import packageJson from "../package.json" assert { type: "json" };

// Backup the original package.json
fs.copyFileSync(packageJsonPath, packageJsonPath + ".bak");

// Change the name to 'fresh-scroll'
packageJson.name = "fresh-scroll";

// Write the modified package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log("Changed package name to fresh-scroll for publishing");
