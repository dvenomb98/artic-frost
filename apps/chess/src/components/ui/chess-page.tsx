import React from "react";

function ChessPage({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-8 h-full w-full chess--layout">{children}</div>;
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
