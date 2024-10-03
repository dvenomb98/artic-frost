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
    <h1 {...props} id={generateId(props.children)} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {props.children}
    </h1>
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2
      {...props}
      id={generateId(props.children)}
      className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight"
    >
      {props.children}
    </h2>
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 {...props} id={generateId(props.children)} className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {props.children}
    </h3>
  ),
  h4: (props: ComponentProps<"h4">) => (
    <h4 {...props} id={generateId(props.children)} className="scroll-m-20 text-xl font-semibold tracking-tight">
      {props.children}
    </h4>
  ),
  p: (props: ComponentProps<"p">) => (
    <p {...props} className="leading-7">
      {props.children}
    </p>
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
    <blockquote {...props} className="mt-6 border-l-2 pl-6 italic">
      {props.children}
    </blockquote>
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2">
      {props.children}
    </ul>
  ),
};

export { components };
