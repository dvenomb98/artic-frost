import fs from "fs";
import path from "path";
import matter from "gray-matter";

const outputDirectory = path.join(process.cwd(), "__registry__");
const outputFile = path.join(outputDirectory, "docs.json");
const dirPath = path.join(process.cwd(), "src", "content", "docs");

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

const _getMdxFiles = () => fs.readdirSync(dirPath).filter((file) => path.extname(file) === ".mdx");

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
      docs.map(({ content, ...rest }) => rest),
      null,
      2
    ),
    "utf-8"
  );
}

main();
