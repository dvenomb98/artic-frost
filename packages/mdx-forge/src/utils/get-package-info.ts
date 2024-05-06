import path from "path"
import fs from "fs"
import { type PackageJson } from "type-fest"

export async function getPackageInfo() {
  const packageJsonPath = path.join("package.json")

  return fs.readFileSync(packageJsonPath) as PackageJson
}