import { useMDXComponents } from "@/lib/hooks/useMdxComponents";
import React, { FC } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface MDXComponentProps {
  content: string
}

export default function MdxComponent ({content}: MDXComponentProps)  {
  const MDXContent = useMDXComponents();
  return (
    <article className="py-10">
      <MDXRemote source={content} components={MDXContent} />
    </article>
  );
};


