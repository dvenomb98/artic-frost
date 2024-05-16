import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { slugify } from "../utils/strings";
import ComponentPreview, { ComponentPreviewProps } from "@/components/docs/_content/component-preview";
import FocusMode from "@/components/ui/focus-mode";
import { highlight } from "sugar-high";
import { cn } from "@repo/ui/lib/utils/cn";
import Avatar from "@/components/docs/_content/avatar";
import Note from "@/components/docs/_content/note";

export function useMDXComponents(): MDXComponents {
  return {
    // HTML 
    a: ({ children, href, ...props }) => (
      <Link href={href as string} {...props} className="font-medium underline">
        {children}
      </Link>
    ),
    h1: ({ children }) => (
      <h1
        id={slugify(children as string)}
        className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-8"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        id={slugify(children as string)}
        className="scroll-m-20 border-b pb-2 text-2xl font-medium tracking-tight first:mt-0 mt-12"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(children as string)}
        className="scroll-m-20 text-xl mt-8 font-medium tracking-tight"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        id={slugify(children as string)}
        className="mt-8 scroll-m-20 text-lg font-medium tracking-tight"
      >
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5
        id={slugify(children as string)}
        className="mt-8 scroll-m-20 text-lg font-medium tracking-tight"
      >
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        id={slugify(children as string)}
        className="mt-8 scroll-m-20 text-base font-medium tracking-tight"
      >
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    strong: ({ children }) => (
      <strong className="p-0.5 px-1 text-foreground font-normal bg-muted rounded-md">
        {children}
      </strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 pl-6 italic">{children}</blockquote>
    ),
    img: (props) => (
      <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...(props as ImageProps)} />
    ),
    code: ({ children }) => (
      <div className="bg-muted/50 overflow-auto p-5 max-h-[550px] text-xs border rounded-md my-6">
        <code dangerouslySetInnerHTML={{ __html: highlight(children as string) }} />
      </div>
    ),
    ul: ({ children }) => <ul className="space-y-4 my-6 list-disc list-inside">{children}</ul>,


    // Content components
    ComponentPreview: ({ className, ...props }: ComponentPreviewProps) => (
      <ComponentPreview className={cn("my-6", className)} {...props} />
    ),
    Avatar: () => <Avatar />,
    Note: (props) => <Note {...props} />,


    // Other components
    FocusMode: (props) => <FocusMode {...props} />,
  };
}
