import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the output directories and file paths
const outputDirectory = path.join(process.cwd(), "__registry__");
const outputRegistryFile = path.join(outputDirectory, "docs-registry.json");
const outputMdxFiles = path.join(outputDirectory, "all");
const dirPath = path.join(process.cwd(), "content", "docs");

// Define the category index for sorting
const categoryIndex = {
  intro: 0,
  guides: 1,
  components: 2,
};

// Ensure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Ensure the directory for MDX files exists
if (!fs.existsSync(outputMdxFiles)) {
  fs.mkdirSync(outputMdxFiles, { recursive: true });
}

/***
 * Get MDX files from the directory
 ***/
function getMdxFiles() {
  return fs.readdirSync(dirPath).filter((file) => path.extname(file) === ".mdx");
}

/***
 * Sort docs by category
 ***/
function sortByCategory(docs) {
  return [...docs].sort((a, b) => {
    const orderA = categoryIndex[a.category];
    const orderB = categoryIndex[b.category];
    return orderA - orderB;
  });
}

/***
 * Get previous and next posts
 ***/
function getPrevNext(posts, slug) {
  const postIndex = posts.findIndex((post) => post.slug === slug);
  const prev = posts[postIndex - 1] || null;
  const next = posts[postIndex + 1] || null;

  return {
    prev: prev ? { title: prev.metadata.as, slug: prev.slug } : null,
    next: next ? { title: next.metadata.as, slug: next.slug } : null,
  };
}

/***
 Generate JSON data for docs
 ***/
function generateDocs(files) {
  if (!files || !files.length) return [];

  const docs = files.map((file) => {
    const parsedFile = matter.read(dirPath + `/${file}`);
    const slug = parsedFile.data.slug || file.split(".mdx")[0];
    const tags = parsedFile.data.tags || [];
    const category = parsedFile.data.category;

    const json = {
      content: parsedFile.content,
      metadata: {
        tags,
        ...parsedFile.data,
      },
      slug,
      category,
    };

    const registryIndex = {
      slug,
      category,
      title: parsedFile.data.as,
    };

    return {
      json,
      registryIndex,
    };
  });

  const sorted = {
    json: sortByCategory(docs.map((doc) => doc.json)),
    registryIndex: sortByCategory(docs.map((doc) => doc.registryIndex)),
  };

  return {
    json: sorted.json.map((doc) => ({ prevNext: getPrevNext(sorted.json, doc.slug), ...doc })),
    registryIndex: sorted.registryIndex,
  };
}

/***
 * Main function to generate docs registry and MDX files
 ***/
function main() {
  const files = getMdxFiles();
  const docs = generateDocs(files);

  if (!docs) {
    console.error("generate-docs-registry.mjs failed because docs is undefined");
    process.exit(1);
  }

  // Write docs registry to file
  console.info("Generating docs-registry.json...");
  fs.writeFileSync(outputRegistryFile, JSON.stringify(docs.registryIndex, null, 2), "utf-8");

  // Write MDX files to directory
  console.info("Generating mdx directory...");
  docs.json.forEach((doc) => {
    fs.writeFileSync(
      path.join(outputMdxFiles, `${doc.slug}.json`),
      JSON.stringify(doc, null, 2),
      "utf-8"
    );
  });
}

// Call the main function to start the process
main();
