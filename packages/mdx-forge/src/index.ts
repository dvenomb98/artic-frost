#!/usr/bin/env node
import { Command } from "commander";
import { init } from "@/commands/init";
import { getPackageInfo } from "@/utils/get-package-info";
import { forge } from "@/commands/forge";

async function main() {
  const packageInfo = await getPackageInfo();

  const program = new Command()
    .name("mdx-forge")
    .description("build your mdx files from command line")
    .version(packageInfo.version || "1.0.0", "-v, --version", "display the version number");

  program.addCommand(init).addCommand(forge)

  program.parse();
}

main();
