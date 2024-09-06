import { ChessPage } from "@/components/ui/chess-page";
import { ReactNode } from "react";

export default function ReviewLayout({ children }: { children: ReactNode }) {
  return <ChessPage>{children}</ChessPage>;
}
