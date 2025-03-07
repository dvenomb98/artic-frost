import {
  ChessPage,
  ChessPageContent,
  ChessPageDescription,
  ChessPageHeader,
  ChessPageTitle,
} from "@/components/chess-page";
import {ReactNode} from "react";

export default function ReviewLayout({children}: {children: ReactNode}) {
  return (
    <ChessPage>
      <ChessPageHeader>
        <ChessPageTitle>Review</ChessPageTitle>
        <ChessPageDescription>View your game review</ChessPageDescription>
      </ChessPageHeader>
      <ChessPageContent>{children}</ChessPageContent>
    </ChessPage>
  );
}
