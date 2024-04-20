import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import Link from "next/link";

export function useMDXComponents(): MDXComponents {
  return {
    a: ({ children, href, ...props }) => (
      <Link href={href as string} {...props} className="link">
        {children}
      </Link>
    ),
    h1: ({ children }) => <h1 className="h1">{children}</h1>,
    h2: ({ children }) => <h2 className="h2">{children}</h2>,
    h3: ({ children }) => <h3 className="h3">{children}</h3>,
    h4: ({ children }) => <h4 className="h4 font-medium">{children}</h4>,
    p: ({ children }) => <p className="text-muted-foreground">{children}</p>,
    strong: ({ children }) => (
      <strong className="p-0.5 px-1 text-foreground font-normal bg-muted rounded-md">
        {children}
      </strong>
    ),
    img: (props) => (
      <Image sizes="100vw" style={{ width: "100%", height: "auto" }} {...(props as ImageProps)} />
    ),
    code: ({children}) => (
      <div className="bg-muted/80 overflow-x-scroll p-5 text-sm border rounded-md">{children}</div>
    )
  };
}
