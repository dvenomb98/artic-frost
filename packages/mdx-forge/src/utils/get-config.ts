import path from "path";
import fs from "fs-extra"
import { IForgeConfig } from "@/lib/types";
import { setup } from "@/lib/project-setup";
import { handleError } from "./handle-error";
import { logger } from "./logger";

/**
 * Returns an IForgeConfig object.
 * 
 * If the config file does not exist, throws an error.
 * 
 * If one of the required keys does not exist, throws an error.
 * 
 */
export async function getConfig(cwd: string) {
  try {
    const configPath = path.join(cwd, setup.configName);

    const file = await fs.readFile(configPath, "utf-8")
    if (!file) {
      throw new Error(
        "Configuration file is missing. Please run init to create mdx.forge.json file"
      );
    }

    const config = JSON.parse(file) as IForgeConfig;

   
    if (!config.contentDirPath) {
      throw new Error("contentDirPath does not exists in mdx.config.json.");
    }
    if (!config.outputDirPath) {
      throw new Error("outputDirPath does not exists in mdx.config.json!");
    }

    if(!config.schema || !Object.entries(config.schema).length) {
      logger.warn("mdx.config.ts is missing schema property, or is empty. Skipping generating typescript file.")
    }

    return config;
  } catch (e) {
    handleError(e);
  }
}
