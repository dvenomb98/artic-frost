import {MarketingFooter} from "@/features/marketing/components/footer";
import {MarketingNavBar} from "@/features/marketing/components/nav-bar";
import {Md} from "@artic-frost/markdown";
import * as fs from "fs/promises";
import {notFound} from "next/navigation";
import path from "path";

const DOCUMENTS_PATH = path.join(process.cwd(), "documents");

async function getDocumentContent(slug: string) {
  const filePath = path.join(DOCUMENTS_PATH, `${slug}.md`);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return content;
  } catch (_) {
    return null;
  }
}

async function generateStaticParams() {
  const files = await fs.readdir(DOCUMENTS_PATH);
  return files.map(file => ({
    slug: file.replace(".md", ""),
  }));
}

async function Page(props: PageProps<"/documents/[slug]">) {
  const {slug} = await props.params;

  const content = await getDocumentContent(slug);

  if (!content) {
    return notFound();
  }

  return (
    <div>
      <MarketingNavBar />
      <div className="page--layout max-w-xl">
        <Md content={content} />
      </div>
      <MarketingFooter />
    </div>
  );
}

export {generateStaticParams};
export default Page;
