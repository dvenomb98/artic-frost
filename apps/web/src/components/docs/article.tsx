import { MdxFile} from "@/lib/types/docs";
import React, { FC } from "react";
import DocsBreadcrumbs from "./docs-breadcrumbs";
import FocusMode from "../ui/focus-mode";
import MdxIntro from "./mdx-intro";
import MDXComponent from "./mdx-component";
import PrevNextButtons from "./prev-next-buttons";

interface ArticleProps {
  doc: MdxFile;
}

const Article: FC<ArticleProps> = ({ doc }) => {
  return (
    <div className="mx-auto w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <DocsBreadcrumbs title={doc.metadata.as} />
        <FocusMode />
      </div>
      <MdxIntro meta={doc.metadata} />
      <MDXComponent content={doc.content} />
      <PrevNextButtons slug={doc.slug} />
    </div>
  );
};

export default Article;
