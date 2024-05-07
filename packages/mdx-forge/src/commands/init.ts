import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import { handleError } from "@/utils/handle-error";
import baseSchema from "@/lib/base-schema.json";
import { setup } from "@/lib/project-setup";
import { logger } from "@/utils/logger";
import prompts from "prompts";
import { IForgeConfig } from "@/lib/types";
import { createExample } from "@/utils/create-example";

export const init = new Command()
  .name("init")
  .description("initialize configuration file")
  .action(async () => {
    try {
      const cwd = process.cwd();

      if (!fs.existsSync(cwd)) {
        throw new Error(`The path ${cwd} does not exist. Please try again.`);
      }

      const { generateSchema, contentDirPath, outputDirPath } = await prompts([
        {
          type: "confirm",
          name: "generateSchema",
          message:
            "Would you like to include base schema in your configuration file to generate types?",
          initial: true,
        },
        {
          type: "text",
          name: "contentDirPath",
          message: "Where is your content folder located? (use relative path)",
          initial: "content/mdx",
        },
        {
          type: "text",
          name: "outputDirPath",
          message: "Where you want to generate your content? (use relative path)",
          initial: ".mdx-forge",
        },
      ]);

      const baseConfig: IForgeConfig = {
        contentDirPath,
        outputDirPath,
        schema: generateSchema ? baseSchema : {},
      };

      await createExample(true, path.join(cwd, contentDirPath));

      const resolvedPath = path.join(cwd, setup.configName);

      await fs.writeFile(resolvedPath, JSON.stringify(baseConfig, null, 2), "utf-8");

      logger.success(
        `\n\nConfiguration file written successfully to ${resolvedPath}.\n\n` +
          `Run 'forge' command to transform your content.\n\n`
      );
      logger.info(
        `If you would like to adjust your schema, refer to https://github.com/bcherny/json-schema-to-typescript\n\n`
      );
    } catch (e) {
      handleError(e);
    }
  });
