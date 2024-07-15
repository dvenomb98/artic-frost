import ChessBoard from "@/chess/components/chess-board";
import { ChessProvider } from "@/chess/context/chess-state-manager";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {

  const supabase = createClient()
  const {data} = await supabase.auth.getUser()
  console.log(data.user)
  // get payload here

  return (
    <ChessProvider>
    <main>
      <ChessBoard/>
    </main>
    </ChessProvider>
  );
}
