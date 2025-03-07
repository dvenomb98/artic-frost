import {notFound} from "next/navigation";

import {components} from "@/components/mdx-components";
import {PageLayout} from "@/features/packages/components/page-layout";

import {
  getStaticFilesData,
  getMdxFile,
} from "@/features/packages/lib/generators";

import {mdxPackagesComponents} from "@/features/packages/components/mdx-packages-comps";
import {compileMdx} from "@/services/mdx/compile-mdx";

type Params = {
  all: [packageName: string, slug: string];
};

export async function generateStaticParams() {
  const filesData = await getStaticFilesData();
  return filesData.map(({packageName, slug}) => ({
    all: [packageName, slug],
  }));
}

export default async function Page(props: {params: Promise<Params>}) {
  const params = await props.params;
  const [packageName, slug] = params.all;
  const mdxSource = await getMdxFile(packageName, slug);

  if (!mdxSource) return notFound();

  const {MDXContent} = await compileMdx(mdxSource);

  return (
    <PageLayout activePackage={packageName}>
      {MDXContent({
        components: {
          ...components,
          ...mdxPackagesComponents,
        },
      })}
    </PageLayout>
  );
}

export async function generateMetadata(props: {params: Promise<Params>}) {
  const params = await props.params;
  const [packageName, slug] = params.all;
  const filesData = await getStaticFilesData();
  const fileData = filesData.find(
    ({packageName: p, slug: s}) => p === packageName && s === slug
  );
  if (!fileData) return null;

  return {
    title: fileData.metadata.title,
    authors: {
      name: "Daniel Bilek",
      url: "https://danielbilek.com",
    },
    openGraph: {
      title: fileData.metadata.title,
      category: fileData.metadata.category,
    },
  };
}
