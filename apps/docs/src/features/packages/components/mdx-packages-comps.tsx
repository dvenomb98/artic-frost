import { cn } from "@artic-frost/ui/lib";
import {
  FreshScrollExample,
  FreshScrollExampleWithError,
  FreshScrollExampleWithInitialData,
} from "../registry/fresh-scroll/components/fresh-scroll-example";
import { MDXComponents } from "mdx/types";
import { ExampleReactChessApp } from "../registry/chess-lite/components/example-react-app";

const MARGIN_TOP = "mt-8";

const mdxPackagesComponents: MDXComponents = {
  FreshScrollExample: props => (
    <div className={cn(MARGIN_TOP)}>
      <FreshScrollExample {...props} />
    </div>
  ),
  FreshScrollExampleWithError: props => (
    <div className={cn(MARGIN_TOP)}>
      <FreshScrollExampleWithError {...props} />
    </div>
  ),
  FreshScrollExampleWithInitialData: props => (
    <div className={cn(MARGIN_TOP)}>
      <FreshScrollExampleWithInitialData {...props} />
    </div>
  ),
  ExampleReactChessApp: props => (
    <div className={cn(MARGIN_TOP)}>
      <ExampleReactChessApp {...props} />
    </div>
  ),
};

export { mdxPackagesComponents };
