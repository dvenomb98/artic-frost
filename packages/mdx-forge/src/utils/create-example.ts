import fs from "fs-extra";
import path from "path";
import { logger } from "./logger";

const example = `---
title: "Example file"
tags:
- hello
- world
category: articles
---

## Vision

Throughout my career, coding has not just been a day job but also a passion that keeps me engaged late into the night. It is during these hours that some of my most creative ideas emerge—ideas that I am eager to experiment with and develop further.

This platform is my way of **sharing those bursts of creativity with you**. 

Whether you're here to find inspiration or to learn something new, I hope these documents serve as a valuable resource. 

**Feel free to pick anything** that catches your eye and use it however you see fit.
`;
export async function createExample(run: boolean, absoluteContentDirPath: string): Promise<void> {
  if (!run) return;

  try {
    await fs.outputFile(path.join(absoluteContentDirPath, "example.mdx"), example, "utf-8");
    logger.info("\nExample file created sucessfully!");
  } catch (e) {
    throw new Error("Something went wrong when creating example file.");
  }
}
