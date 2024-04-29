import { MdxFile} from "@/lib/types/docs";
import DocsBreadcrumbs from "./docs-breadcrumbs";
import FocusMode from "../ui/focus-mode";
import MdxIntro from "./mdx-intro";
import MDXComponent from "./mdx-component";
import PrevNextButtons from "./prev-next-buttons";

const focusIds = ["docs-sidebar-root", "docs-tree-root", "navbar-root", "footer-root"]

interface ArticleProps {
  doc: MdxFile;
}

export default function Article ({doc}: ArticleProps) {
  return (
    <div className="mx-auto w-full min-w-0">
      <div className="flex items-center justify-between mb-4">
        <DocsBreadcrumbs title={doc.metadata.as} />
        <FocusMode ids={focusIds} />
      </div>
      <MdxIntro meta={doc.metadata} />
      <MDXComponent content={doc.content} />
      <PrevNextButtons slug={doc.slug} />
    </div>
  );
};


