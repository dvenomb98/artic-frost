import fs from "fs";
import path from "path";
import matter from "gray-matter";

const outputDirectory = path.join(process.cwd(), "__registry__");
const outputFile = path.join(outputDirectory, "docs.json");
const dirPath = path.join(process.cwd(), "src", "content", "docs");

// TODO: Dont repeat this config (config/docs.ts)
const categoryIndex = {
  intro: 0,
  guides: 1,
  components: 2,
};

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

const _getMdxFiles = () => fs.readdirSync(dirPath).filter((file) => path.extname(file) === ".mdx");


// TODO: Dont repeat this function (mdx-utils.ts)
function _sortByCategory(docs) {
  return [...docs].sort((a, b) => {
    const orderA = categoryIndex[a.category];
    const orderB = categoryIndex[b.category];
    return orderA - orderB;
  });
}

function main() {
  const files = _getMdxFiles(dirPath);

  const docs = files.map((file) => {
    const parsedFile = matter.read(dirPath + `/${file}`);
    const slug = parsedFile.data.slug || file.split(".mdx")[0];

    return {
      slug,
      category: parsedFile.data.category,
      title: parsedFile.data.as,
    };
  });

  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      _sortByCategory(docs).map(({ content, ...rest }) => rest),
      null,
      2
    ),
    "utf-8"
  );
}

main();
