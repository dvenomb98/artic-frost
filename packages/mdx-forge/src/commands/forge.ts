import { IForgeConfig } from "@/lib/types";
import { getConfig } from "@/utils/get-config";
import { handleError } from "@/utils/handle-error";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { logger } from "@/utils/logger";
import { compile } from "json-schema-to-typescript";

export const forge = new Command()
  .name("forge")
  .description("generate a json files from your mdx directory")
  .action(async () => {
    try {
      const cwd = path.join(process.cwd());

      // Ensure target directory exists.
      if (!fs.existsSync(cwd)) {
        throw new Error(`The path ${cwd} does not exist. Please try again.`);
      }

      const config = (await getConfig(cwd)) as IForgeConfig;

      const { contentDirPath, outputDirPath, schema = {} } = config;

      const absoluteDirPath = path.join(cwd, contentDirPath);
      const absoluteOutputDirPath = path.join(cwd, outputDirPath);

      const filesPath = (await getMdxFilesPaths(absoluteDirPath)) as string[];
      const generated = await generator(filesPath, absoluteDirPath);

      if (Object.keys(schema).length) {
        const ts = await compile(schema, "MdxForgeJson");
        fs.writeFileSync(path.join(absoluteOutputDirPath, "mdx-file-interface.ts"), ts);
      }

      // Ensure the directory for MDX files exists
      if (!fs.existsSync(absoluteOutputDirPath)) {
        fs.mkdirSync(absoluteOutputDirPath, { recursive: true });
      }

      generated.forEach((item) =>
        fs.writeFileSync(
          path.join(absoluteOutputDirPath, `${item.fileName}.json`),
          JSON.stringify(item, null, 2),
          "utf-8"
        )
      );

      logger.success(`Files generated sucessfully to ${absoluteOutputDirPath}`);
    } catch (e) {
      handleError(e);
    }
  });

async function getMdxFilesPaths(absoluteDirPath: string) {
  try {
    // Ensure target directory exists.
    if (!fs.existsSync(absoluteDirPath)) {
      throw new Error(
        `${absoluteDirPath} does not exist. Please make sure that provided path is correct.`
      );
    }

    const paths = fs.readdirSync(absoluteDirPath).filter((file) => path.extname(file) === ".mdx");

    if (!paths?.length) {
      throw new Error(`${absoluteDirPath} does not contain any .mdx files.`);
    }

    return paths;
  } catch (e) {
    throw e;
  }
}

export async function generator(paths: string[], absoluteDirPath: string) {
  try {
    const files = paths.map((file) => {
      const parsedFile = matter.read(absoluteDirPath + `/${file}`);

      const json = {
        content: parsedFile.content,
        metadata: {
          ...parsedFile.data,
        },
        fileName: file.split(".mdx")[0],
      };

      return json;
    });
    return files;
  } catch (e) {
    throw e;
  }
}
