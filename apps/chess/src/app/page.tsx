import ChessBoard from "@/chess/components/chess-board";
import { ChessProvider } from "@/chess/context/chess-state-manager";

export default function Home() {
  return (
    <ChessProvider>
    <main>
      <ChessBoard/>
    </main>
    </ChessProvider>
  );
}
