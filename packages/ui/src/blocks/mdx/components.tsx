import { slugify } from "@ui/lib";
import { ComponentProps, ReactNode } from "react";

const generateId = (children: ReactNode) => {
  if (typeof children === "string") {
    return slugify(children);
  }
  return undefined;
};

const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 {...props} id={generateId(props.children)} className="scroll-m-20 h1">
      {props.children}
    </h1>
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2
      {...props}
      id={generateId(props.children)}
      className="scroll-m-20 border-b pb-2 h2"
    >
      {props.children}
    </h2>
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 {...props} id={generateId(props.children)} className="scroll-m-20 h3">
      {props.children}
    </h3>
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h4 {...props} id={generateId(props.children)} className="scroll-m-20 h4">
      {props.children}
    </h4>
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong
      {...props}
      className="p-0.5 px-1 text-foreground font-normal bg-muted rounded-md"
    >
      {props.children}
    </strong>
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote {...props} className="border-l-2 pl-6 italic">
      {props.children}
    </blockquote>
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul {...props} className="space-y-4 list-disc list-inside">
      {props.children}
    </ul>
  ),
};

export { components };
