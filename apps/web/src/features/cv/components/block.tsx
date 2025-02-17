import { cn } from "@artic-frost/ui/lib";
import * as React from "react";

function Block({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

function BlockTitle({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className="text-lg font-semibold" {...props}>
      {children}
    </h2>
  );
}

function BlockDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground">{children}</p>;
}

function BlockContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-5", className)}>{children}</div>;
}

export { Block, BlockDescription, BlockContent, BlockTitle };
