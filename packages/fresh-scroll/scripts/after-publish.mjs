import fs from "fs";
import path from "path";

const packageJsonPath = path.resolve(
  new URL(".", import.meta.url).pathname,
  "../package.json"
);

fs.copyFileSync(packageJsonPath + ".bak", packageJsonPath);
fs.unlinkSync(packageJsonPath + ".bak");

console.log("Restored original package.json after publishing");
