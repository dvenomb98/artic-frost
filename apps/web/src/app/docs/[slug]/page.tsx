import Article from "@/components/docs/article";
import MdxTree from "@/components/docs/mdx-tree";
import { allDocsResolved } from "@/lib/utils/mdx-utils";
import { getTocs } from "@/lib/utils/tocs";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDocFromFileName } from "@/lib/utils/mdx-utils-server";

interface DocPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return allDocsResolved.map((file) => ({
    slug: file.fileName,
  }));
}

async function getDocFromParams({ params }: DocPageProps) {
  const doc = await getDocFromFileName(params.slug)

  if (!doc || doc.draft) {
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
    title: doc.title,
    description: doc.summary,
    openGraph: {
      title: doc.title,
      description: doc.summary,
      type: "article",
      url: "https://danielbilek.com/docs/" + params.slug,
      tags: doc.tags || [],
    },
  };
}

async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params });

  if (!doc) {
    notFound();
  }

  const tocs = getTocs(doc.content);

  return (
    <section className="py-8 space-y-5 lg:gap-10 lg:grid lg:grid-cols-[1fr_200px]">
      <Article doc={doc} />
      {tocs?.length && (
        <div className="hidden text-sm lg:block">
          <div className="sticky top-16 -mt-14 pt-4">
            <ScrollArea className="pb-10">
              <div className="h-[calc(100vh-3.5rem)] py-4">
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
