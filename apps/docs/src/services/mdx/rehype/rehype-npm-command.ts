import {UnistNode, UnistTree} from "@/services/mdx/types/unist";
import {visit} from "unist-util-visit";

function rehypeNpmCommand() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.type !== "element" || node?.tagName !== "pre") {
        return;
      }

      // npm install.
      if (node.properties?.["__raw_string__"]?.startsWith("npm install")) {
        const npmCommand = node.properties?.["__raw_string__"];
        node.properties["__npmCommand__"] = npmCommand;
        node.properties["__yarnCommand__"] = npmCommand.replace(
          "npm install",
          "yarn add"
        );
        node.properties["__pnpmCommand__"] = npmCommand.replace(
          "npm install",
          "pnpm add"
        );
        node.properties["__bunCommand__"] = npmCommand.replace(
          "npm install",
          "bun add"
        );
      }
    });
  };
}

export {rehypeNpmCommand};
