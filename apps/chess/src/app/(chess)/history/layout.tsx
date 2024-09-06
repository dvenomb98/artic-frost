import {
  ChessPage,
  ChessPageContent,
  ChessPageDescription,
  ChessPageHeader,
  ChessPageTitle,
} from "@/components/ui/chess-page";
import React from "react";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChessPage>
      <ChessPageHeader>
        <ChessPageTitle>History</ChessPageTitle>
        <ChessPageDescription>View your game history</ChessPageDescription>
      </ChessPageHeader>
      <ChessPageContent>
        {children}
      </ChessPageContent>
    </ChessPage>
  )
}
