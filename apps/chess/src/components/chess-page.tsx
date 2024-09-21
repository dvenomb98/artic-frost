import { cn } from "@ui/lib";
import React from "react";

function ChessPage({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-8 h-full w-full px-5 py-10 mx-auto lg:max-w-[1280px]", className)}>
      {children}
    </div>
  );
}

function ChessPageHeader({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function ChessPageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="h2">{children}</h1>;
}

function ChessPageDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-muted-foreground">{children}</div>;
}

function ChessPageContent({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 h-full w-full">{children}</div>;
}

export {
  ChessPage,
  ChessPageHeader,
  ChessPageTitle,
  ChessPageDescription,
  ChessPageContent,
};
