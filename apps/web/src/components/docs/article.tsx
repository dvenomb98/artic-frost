import DocsBreadcrumbs from "./docs-breadcrumbs";
import FocusMode from "../ui/focus-mode";
import MdxIntro from "./mdx-intro";
import MDXComponent from "./mdx-component";
import PrevNextButtons from "./prev-next-buttons";
import { MdxFileInterface } from "@mdx-forge";
import { allDocsResolved, getPrevNext } from "@/lib/utils/mdx-utils";


const focusIds = ["docs-sidebar-root", "docs-tree-root", "navbar-root", "footer-root"];
interface ArticleProps {
  doc: MdxFileInterface;
}

export default function Article({ doc }: ArticleProps) {
  const { content, ...rest } = doc;
  const prevNext = getPrevNext(allDocsResolved, doc.fileName);

  return (
    <div className="mx-auto w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <DocsBreadcrumbs title={doc.as} />
        <FocusMode ids={focusIds} />
      </div>
      <MdxIntro meta={rest} />
      <MDXComponent content={content} />
      <PrevNextButtons prevNext={prevNext} />
    </div>
  );
}
