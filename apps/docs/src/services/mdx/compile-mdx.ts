import { compile, run } from "@mdx-js/mdx";
import { visit } from "unist-util-visit";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";

import { UnistNode } from "@/services/mdx/types/unist";

import { options } from "./rehype/rehype-pretty-options";
import { rehypeNpmCommand } from "./rehype/rehype-npm-command";

export async function compileMdx(mdxSource: string) {
  const code = String(
    await compile(mdxSource, {
      outputFormat: "function-body",
      rehypePlugins: [
        () => tree => {
          visit(tree, "element", (node: UnistNode) => {
            if (node.tagName === "pre") {
              const codeEl = node.children?.at(0);
              if (codeEl?.tagName !== "code") return;
              node.properties = node.properties || {};
              node.properties.__raw_string__ = codeEl.children?.[0]?.value;
            }
          });
        },
        [rehypePrettyCode, options],
        () => tree => {
          visit(tree, "element", (node: UnistNode) => {
            if (!(node.type === "element" && node.tagName === "figure")) return;
            if (!node.properties?.__raw_string__) return;

            const preElement = node?.children?.at(-1);
            if (preElement?.tagName !== "pre") return;

            preElement.properties = preElement.properties || {};
            preElement.properties.__raw_string__ =
              node.properties.__raw_string__;
          });
        },
        rehypeNpmCommand,
      ],
    })
  );

  const { default: MDXContent} = await run(code, {
    ...(runtime as any),
    baseUrl: import.meta.url,
  });

  return { MDXContent };
}
