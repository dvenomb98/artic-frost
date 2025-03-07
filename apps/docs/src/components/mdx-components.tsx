import {MDXComponents} from "mdx/types";
import {cn, slugify} from "@artic-frost/ui/lib";
import * as React from "react";
import {CopyButton, CopyNpmCommandButton} from "@artic-frost/ui/components";
import {NpmCommands} from "@/services/mdx/types/unist";

const MARGIN_TOP = "mt-8";

const generateId = (children: React.ReactNode) => {
  if (typeof children === "string") {
    return slugify(children);
  }
  return undefined;
};

const components: MDXComponents = {
  h1: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      id={generateId(props.children)}
      className={cn("font-heading text-4xl font-bold", MARGIN_TOP, className)}
      {...props}
    />
  ),
  h2: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={generateId(props.children)}
      className={cn(
        "font-heading border-b pb-2 text-2xl font-semibold tracking-tight",
        MARGIN_TOP,
        className
      )}
      {...props}
    />
  ),
  h3: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={generateId(props.children)}
      className={cn(
        "font-heading text-xl font-semibold tracking-tight",
        MARGIN_TOP,
        className
      )}
      {...props}
    />
  ),
  h4: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={generateId(props.children)}
      className={cn(
        "font-heading text-lg font-semibold tracking-tight",
        MARGIN_TOP,
        className
      )}
      {...props}
    />
  ),
  h5: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      id={generateId(props.children)}
      className={cn(
        "text-lg font-semibold tracking-tight",
        MARGIN_TOP,
        className
      )}
      {...props}
    />
  ),
  h6: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      id={generateId(props.children)}
      className={cn(
        "text-base font-semibold tracking-tight",
        MARGIN_TOP,
        className
      )}
      {...props}
    />
  ),
  a: ({className, ...props}: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn("font-medium underline underline-offset-4", className)}
      {...props}
    />
  ),
  p: ({className, ...props}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7", MARGIN_TOP, className)} {...props} />
  ),
  ul: ({className, ...props}: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("ml-6 list-disc", MARGIN_TOP, className)} {...props} />
  ),
  ol: ({className, ...props}: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("ml-6 list-decimal", MARGIN_TOP, className)} {...props} />
  ),
  li: ({className, ...props}: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({className, ...props}: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("border-l-2 pl-6 italic", MARGIN_TOP, className)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("rounded-md", MARGIN_TOP, className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({...props}: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className={MARGIN_TOP} {...props} />
  ),
  table: ({className, ...props}: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="w-full overflow-y-auto rounded-lg">
      <table
        className={cn(
          "w-full overflow-hidden rounded-lg",
          MARGIN_TOP,
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({className, ...props}: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("border-t p-0", className)} {...props} />
  ),
  th: ({className, ...props}: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({className, ...props}: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className
      )}
      {...props}
    />
  ),
  pre: ({
    className,
    __raw_string__,
    __npmCommand__,
    __yarnCommand__,
    __pnpmCommand__,
    __bunCommand__,
    ...props
  }: React.HTMLAttributes<HTMLPreElement> & {
    __raw_string__?: string;
  } & NpmCommands) => {
    return (
      <div className="relative w-full">
        <pre
          className={cn(
            "max-h-[450px] w-full",
            "scroll-mb-20",
            "overflow-y-auto",
            "w-full rounded-lg border",
            MARGIN_TOP,
            className
          )}
          {...props}
        />
        {__raw_string__ && !__npmCommand__ && (
          <CopyButton
            value={__raw_string__}
            className={cn("absolute right-4 top-4")}
          />
        )}
        {__npmCommand__ &&
          __yarnCommand__ &&
          __pnpmCommand__ &&
          __bunCommand__ && (
            <CopyNpmCommandButton
              commands={{
                __npmCommand__,
                __yarnCommand__,
                __pnpmCommand__,
                __bunCommand__,
              }}
              className={cn("absolute right-4 top-4")}
            />
          )}
      </div>
    );
  },
  code: ({className, ...props}) => (
    <code
      className={cn(
        "relative rounded p-4 font-mono text-sm overflow-x-auto",
        className
      )}
      {...props}
    />
  ),
  NoteBlock: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={cn("border rounded p-4 mt-8 text-sm", MARGIN_TOP, className)}>
      {children}
    </div>
  ),
};

export {components};
