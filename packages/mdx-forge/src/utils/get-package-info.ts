import path from "path"
import fs from "fs-extra"
import { type PackageJson } from "type-fest"

export async function getPackageInfo() {
  const packageJsonPath = path.join("package.json")
  return await fs.readJson(packageJsonPath) as PackageJson
}