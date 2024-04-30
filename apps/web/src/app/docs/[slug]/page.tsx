import Article from "@/components/docs/article";
import MdxTree from "@/components/docs/mdx-tree";
import { getDocsFiles } from "@/lib/utils/mdx-utils";
import { getTocs } from "@/lib/utils/tocs";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface DocPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const files = await getDocsFiles();
  return files.map((file) => ({
    slug: file.slug,
  }));
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug;
  const files = await getDocsFiles();
  const doc = files.find((doc) => doc.slug === slug);

  if (!doc) {
    return null;
  }

  return doc;
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    return {};
  }

  return {
    title: doc.metadata.title,
    description: doc.metadata.summary,
    openGraph: {
      title: doc.metadata.title,
      description: doc.metadata.summary,
      type: "article",
      url: "https://danielbilek.com/docs/" + doc.slug,
      tags: doc.metadata.tags || [],
    },
  };
}

async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc || doc.metadata.draft) {
    notFound();
  }

  const tocs = getTocs(doc.content);

  return (
    <section className="py-8 space-y-5 lg:gap-10 lg:grid lg:grid-cols-[1fr_200px]">
      <Article doc={doc} />
      {tocs?.length && (
        <div className="hidden text-sm lg:block">
          <div className="sticky top-16 -mt-10 pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12">
                <MdxTree tocs={tocs} />
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
    </section>
  );
}

export default DocPage;
