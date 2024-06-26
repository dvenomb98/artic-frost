import fs from "fs-extra";
import { IForgeConfig } from "@/lib/types";
import { getConfig } from "@/utils/get-config";
import { handleError } from "@/utils/handle-error";
import { Command } from "commander";
import path from "path";
import matter from "gray-matter";
import { logger } from "@/utils/logger";
import { compile } from "json-schema-to-typescript";
import { setup } from "@/lib/project-setup";
import { BANNER_COMMENT, writeExportTemplate } from "@/utils/templates";

export const forge = new Command()
  .name("forge")
  .description("generate JSON files from your MDX directory")
  .action(async () => {
    try {
      const cwd = process.cwd();

      if (!fs.existsSync(cwd)) {
        throw new Error(`The path ${cwd} does not exist. Please try again.`);
      }

      /*
       * Retrieve the configuration and validate it
       */
      const config = await getConfig(cwd);
      const { contentDirPath, outputDirPath, schema = {} } = config as IForgeConfig;

      const absoluteContentPath = path.join(cwd, contentDirPath);
      const absoluteOutputPath = path.join(cwd, outputDirPath);

      /*
       * If a schema is provided, compile it to TypeScript
       */
      if (Object.keys(schema).length) {
        const ts = await compile(schema, setup.tsFileName, { bannerComment: BANNER_COMMENT });
        await fs.outputFile(
          path.join(absoluteOutputPath, setup.typesDirName, setup.tsFileName),
          ts
        );
      }

      /*
       * Generate JSON files from the MDX directory
       */
      const generated = await generator(absoluteContentPath);
      await writeGenerated(generated, absoluteOutputPath);
      await writeExportTemplate(absoluteOutputPath);

      logger.success(`\nFiles generated successfully to ${absoluteOutputPath}\n`);
    } catch (e) {
      handleError(e);
    }
  });

async function generator(absoluteContentPath: string) {
  try {
    if (!fs.existsSync(absoluteContentPath)) {
      throw new Error(
        `${absoluteContentPath} does not exist. Please make sure that provided path is correct.`
      );
    }
    const paths = await fs.readdir(absoluteContentPath);
    const filtered = (paths || []).filter((file) => path.extname(file) === ".mdx");

    if (!filtered?.length) {
      throw new Error(`${absoluteContentPath} does not contain any .mdx files.`);
    }

    const files = paths.map((file) => {
      const parsedFile = matter.read(absoluteContentPath + `/${file}`);

      const json = {
        ...parsedFile.data,
        content: parsedFile.content,
        fileName: file.split(".mdx")[0],
      };

      return json;
    });
    return files;
  } catch (e: any) {
    throw new Error("Something went wrong when generating content" + e?.message);
  }
}

async function writeGenerated(generated: any, absoluteOutputPath: string) {
  try {
    logger.info("\nWritting following files into outputDir:\n");
    const index = [];

    for (const item of generated) {
      await fs.outputFile(
        path.join(absoluteOutputPath, setup.contentDirName, `${item.fileName}.json`),
        JSON.stringify(item, null, 2),
        "utf-8"
      );
      index.push({ ...item, content: undefined });
      logger.info(`${item.fileName}.json`);
    }
    // create index
    await fs.outputFile(
      path.join(absoluteOutputPath, setup.contentDirName, "index.json"),
      JSON.stringify(index),
      "utf-8"
    );

    logger.info(`index.json`);
  } catch (e) {
    throw new Error("Something went wrong when writting generating files to:" + absoluteOutputPath);
  }
}
