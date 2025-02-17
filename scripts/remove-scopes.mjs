import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

async function removeScopes() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const packagesDir = path.resolve(__dirname, "../packages");

  let packages;
  try {
    packages = await fs.readdir(packagesDir);
  } catch (err) {
    console.error("Failed to read packages directory:", err);
    return;
  }
  for (const pkg of packages) {
    const pkgPath = path.join(packagesDir, pkg, "package.json");

    try {
      await fs.access(pkgPath);
    } catch {
      continue;
    }

    try {
      const packageJsonData = await fs.readFile(pkgPath, "utf8");
      const packageJson = JSON.parse(packageJsonData);

      if (packageJson.name && packageJson.name.startsWith("@artic-frost/")) {
        packageJson.name = packageJson.name.replace("@artic-frost/", "");
      }
      const depTypes = ["dependencies", "devDependencies", "peerDependencies"];
      for (const depType of depTypes) {
        if (packageJson[depType]) {
          const deps = packageJson[depType];
          for (const dep of Object.keys(deps)) {
            if (dep.startsWith("@artic-frost/")) {
              const newDepName = dep.replace("@artic-frost/", "");
              deps[newDepName] = deps[dep];
              delete deps[dep];
            }
          }
        }
      }

      const updatedPackageJsonData = JSON.stringify(packageJson, null, 2);
      await fs.writeFile(pkgPath, updatedPackageJsonData);
      console.log(`Updated package.json for ${pkg}`);
    } catch (err) {
      console.error(`Error processing ${pkgPath}:`, err);
    }
  }
}

removeScopes().catch(err => {
  console.error("An unexpected error occurred:", err);
});
