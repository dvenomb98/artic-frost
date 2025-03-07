import {globby} from "globby";
import path from "path";
import {promises as fs} from "fs";
import {evaluate} from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import {METADATA_SCHEMA} from "./definitions";
import {z} from "zod";

interface FileData {
  packageName: string;
  slug: string;
  rawPath: string;
  metadata: z.infer<typeof METADATA_SCHEMA>;
}

const MDX_FILE_PATTERN = "*/content/*.{md,mdx}";

let filesDataCache: FileData[] | null = null;

async function getStaticFilesData() {
  if (filesDataCache) {
    return filesDataCache;
  }

  const contentPath = getContentPath();
  try {
    const files = await globby(MDX_FILE_PATTERN, {
      cwd: contentPath,
    });

    const filesData: FileData[] = [];

    for (const file of files) {
      const [packageName, _, fileName] = file.split(path.sep);

      if (!packageName || !fileName) {
        console.warn(`Skipping invalid file path: ${file}`);
        continue;
      }

      try {
        const {_, ...rest} = await evaluate(
          await readMDXFile(file),
          runtime as any
        );

        const metadata = METADATA_SCHEMA.parse(rest.metadata);

        filesData.push({
          packageName,
          slug: fileName.replace(".mdx", ""),
          rawPath: file,
          metadata: {
            category: metadata.category,
            title: metadata.title,
            order: metadata.order,
          },
        });
      } catch (e) {
        console.error(`Error parsing file ${file}:`, e);
        throw e;
      }
    }

    filesDataCache = filesData;
    return filesData;
  } catch (e) {
    console.error("Error reading files", e);
    throw e;
  }
}

function getContentPath() {
  return path.join(process.cwd(), "src", "features", "packages", "registry");
}

async function readMDXFile(filePath: string) {
  const contentPath = getContentPath();
  const rawContent = await fs.readFile(
    path.join(contentPath, filePath),
    "utf-8"
  );
  return rawContent;
}

async function getMdxFile(
  packageName: string,
  slug: string
): Promise<string | null> {
  try {
    const filesData = await getStaticFilesData();
    const file = filesData.find(
      p => p.packageName === packageName && p.slug === slug
    );

    if (!file) return null;

    return readMDXFile(file.rawPath);
  } catch (error) {
    console.error("Error getting MDX file:", error);
    throw error;
  }
}

export {getStaticFilesData, getMdxFile, type FileData};
