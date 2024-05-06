#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import fs from "fs";
import { handleError } from "@/utils/handle-error";
import defaultConfig from "@/lib/default-config.json";
import { setup } from "@/lib/project-setup";
import { logger } from "@/utils/logger";

export const init = new Command()
  .name("init")
  .description("initialize configuration file")
  .action(async () => {
    try {
      const cwd = path.join(process.cwd());

      // Ensure target directory exists.
      if (!fs.existsSync(cwd)) {
        throw new Error(`The path ${cwd} does not exist. Please try again.`);
      }

      const resolvedPath = path.join(cwd, setup.name);

      await fs.promises.writeFile(resolvedPath, JSON.stringify(defaultConfig, null, 2), "utf-8");

      logger.success(`Configuration file written sucessfully to ${resolvedPath}`);
    } catch (e) {
      handleError(e);
    }
  });
