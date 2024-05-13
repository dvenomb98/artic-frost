import fs from "fs";
import path from "path";
import { MdxFileInterface } from "@mdx-forge";

export async function getDocFromFileName(fileName: string) {
  try {
    const cwd = process.cwd();
    const file = await fs.promises.readFile(
      path.join(cwd, ".mdx-forge/content", `${fileName}.json`),
      "utf8"
    );
    return JSON.parse(file) as MdxFileInterface;
  } catch (e: any) {
    throw new Error("Something went wrong: getDocFromFileName():" + e?.message);
  }
}
