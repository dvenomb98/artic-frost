import {
  ChessPage,
  ChessPageContent,
  ChessPageDescription,
  ChessPageHeader,
  ChessPageTitle,
} from "@/components/chess-page";
import React from "react";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChessPage>
      <ChessPageHeader>
        <ChessPageTitle>Analytics</ChessPageTitle>
        <ChessPageDescription>View your game analytics</ChessPageDescription>
      </ChessPageHeader>
      <ChessPageContent>{children}</ChessPageContent>
    </ChessPage>
  );
}
