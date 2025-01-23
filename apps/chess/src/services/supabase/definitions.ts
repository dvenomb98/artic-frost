import {
  Chat,
  ChessUser,
  GameState,
  GameType,
} from "@/features/chess/store/definitions";
import { SupabaseClient } from "@supabase/supabase-js";


interface RawGameData {
  id: string; 
  fen: string;
  created_at: string;
  movesHistory: string
  history: string[];
  winnerId: string | null;
  gameState: GameState;
  users: ChessUser[];
  chat: Chat[];
  type: GameType;
}

interface UserGamesData {
  game_id: string;
  user_id: string;
  created_at: string;
  id: number;
}

type ProvidedClient = SupabaseClient<any, "public", any>;

export { type RawGameData, type UserGamesData, type ProvidedClient };
