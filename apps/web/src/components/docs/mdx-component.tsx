import { useMDXComponents } from "@/lib/hooks/useMdxComponents";
import React, { FC } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

interface MDXComponentProps {
  content: string
}

const MDXComponent: FC<MDXComponentProps> = ({ content }) => {
  const MDXContent = useMDXComponents();
  return (
    <article className="py-10">
      <MDXRemote source={content} components={MDXContent} />
    </article>
  );
};

export default MDXComponent;
