import {MarkdownAsync} from "react-markdown";
import {components} from "./components";
import {OPTIONS} from "./highlighter";
import rehypePrettyCode from "rehype-pretty-code";

const Md = ({content}: {content: string}) => {
  return (
    <MarkdownAsync
      rehypePlugins={[[rehypePrettyCode, OPTIONS]]}
      components={components}>
      {content}
    </MarkdownAsync>
  );
};

export {Md};
