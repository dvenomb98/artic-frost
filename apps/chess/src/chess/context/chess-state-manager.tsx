"use client";

import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";
import { ChessState } from "../lib/definitions";
import { createClient } from "@/utils/supabase/client";
import { generateFen, convertMoveHistoryToString } from "../lib/fen";
import { getCurrentUser } from "../lib/users";
import { RawGameData } from "@/utils/supabase/definitions";
import useStockfish from "@/utils/stockfish/use-stockfish";
import { Tables } from "@/utils/supabase/tables";

interface ChessContextType {
  state: ChessState;
  isCurrentUserTurn: boolean;
  dispatch: Dispatch<ActionType>;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

interface ChessProviderProps {
  children: ReactNode;
  providedValues: ChessState;
}

function ChessProvider({ children, providedValues }: ChessProviderProps) {
  const [state, dispatch] = useReducer(chessReducer, providedValues);
  const { getNewFen } = useStockfish(state.type === "engine");
  const client = createClient();

  const isCurrentUserTurn = useMemo(() => {
    const user = getCurrentUser(state.currentUserId, state.users);
    if (!user) return false;
    return user.role === state.onTurn;
  }, [state.currentUserId, state.users, state.onTurn]);

  useEffect(() => {
    async function sendDataToSupabase(): Promise<string | null> {
      // Sending data to supabase
      // Based on half moves value as it indicates that player finished his turn
      // Dont need to send a first payload, as the player didnt finish his first round yet
      // Only current user should send payload
      if (!state.halfMoves || isCurrentUserTurn) return null;

      const fen = generateFen(state);
      const movesHistory = convertMoveHistoryToString(state.movesHistory);

      // Only send a mutable values, as others will not change/are not needed
      const data = {
        fen,
        gameState: state.gameState,
        movesHistory,
        winnerId: state.winnerId,
      };

      const { error } = await client
        .from(Tables.GAMES_DATA)
        .update(data)
        .eq("id", state.id);

      if (error) {
        // Prevent desync
        // TODO: refactor to toast
        throw error;
      }

      return fen;
    }
    async function generateEngineMove(fen: string) {
      try {
        const engineFen = await getNewFen(fen);
        dispatch({ type: "ENGINE_MOVE", payload: engineFen });
      } catch (e) {
         // TODO: refactor to toast
        throw e;
      }
    }

    async function sendData() {
      // Sending data to supabase
      const fen = await sendDataToSupabase();
      // Run stockfish if needed to generate second move
      if (state.type === "engine" && !isCurrentUserTurn && fen) {
        await generateEngineMove(fen);
      }
    }

    sendData();
  }, [state.halfMoves, client, isCurrentUserTurn]);

  useEffect(() => {
    if (state.type === "engine") return;

    const subscription = client
      .channel("public:GAMES_DATA")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "GAMES_DATA",
          filter: `id=eq.${state.id}`,
        },
        async (payload) => {
          dispatch({
            type: "UPDATE_PAYLOAD",
            payload: payload.new as RawGameData,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ChessContext.Provider value={{ state, dispatch, isCurrentUserTurn }}>
      {children}
    </ChessContext.Provider>
  );
}

function useChessManager(): ChessContextType {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error("useChessManager must be used within a ChessProvider");
  }
  return context;
}

export { ChessProvider, useChessManager };
