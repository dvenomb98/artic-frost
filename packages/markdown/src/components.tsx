import {cn, slugify} from "@artic-frost/ui/lib";

import * as React from "react";

const MARGIN_TOP = "mt-8";

const generateId = (children: React.ReactNode) => {
  if (typeof children === "string") {
    return slugify(children);
  }
  return undefined;
};

const components = {
  h1: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      id={generateId(props.children)}
      className={cn("h1 first:mt-0", MARGIN_TOP)}
      {...props}
    />
  ),
  h2: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      id={generateId(props.children)}
      className={cn("border-b pb-2 h2", MARGIN_TOP)}
      {...props}
    />
  ),
  h3: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      id={generateId(props.children)}
      className={cn("h3", MARGIN_TOP)}
      {...props}
    />
  ),
  h4: ({className, ...props}: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      id={generateId(props.children)}
      className={cn("h4", MARGIN_TOP)}
      {...props}
    />
  ),
  a: ({className, ...props}: React.HTMLAttributes<HTMLAnchorElement>) => (
    <a className={cn("font-medium underline underline-offset-4")} {...props} />
  ),
  p: ({className, ...props}: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("leading-7", MARGIN_TOP)} {...props} />
  ),
  ul: ({className, ...props}: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("ml-6 list-disc", MARGIN_TOP)} {...props} />
  ),
  ol: ({className, ...props}: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("ml-6 list-decimal", MARGIN_TOP)} {...props} />
  ),
  li: ({className, ...props}: React.HTMLAttributes<HTMLElement>) => (
    <li className={cn("mt-2")} {...props} />
  ),
  blockquote: ({className, ...props}: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn("border-l-2 pl-6 italic text-muted-foreground", MARGIN_TOP)}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={cn("rounded-md", MARGIN_TOP)} alt={alt} {...props} />
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
    <tr className={cn("border-t p-0")} {...props} />
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
  pre: ({className, ...props}: React.HTMLAttributes<HTMLPreElement> & {}) => {
    return (
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
    );
  },
  code: ({className, ...props}: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded p-4 font-mono text-sm overflow-x-auto",
        className
      )}
      {...props}
    />
  ),
};

export {components};
