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
import { generateFen } from "../lib/fen";
import { getCurrentUser } from "../lib/users";
import { RawGameData } from "@/utils/supabase/definitions";
import useStockfish from "@/utils/stockfish/use-stockfish";
import { sendGameDataToSupabase } from "@/utils/supabase/requests/send-game-data";

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
  const { getEngineFen } = useStockfish(state.type === "engine");
  const client = createClient();

  const isCurrentUserTurn = useMemo(() => {
    const user = getCurrentUser(state.currentUserId, state.users);
    if (!user) return false;
    return user.role === state.onTurn;
  }, [state.currentUserId, state.users, state.onTurn]);

  useEffect(() => {
    // Sending data to supabase
    // Based on half moves value as it indicates that player finished his turn
    // Dont need to send a first payload, as the player didnt finish his first round yet
    // Only current user should send payload
    if (!state.halfMoves || isCurrentUserTurn) return;
    sendGameDataToSupabase(state, client);
  }, [state.halfMoves, client, isCurrentUserTurn]);

  useEffect(() => {
    // Separate useEffect to handle engine moves
    // DONT run when we dont play vs engine

    if (state.type !== "engine") return;

    async function generateEngineMove() {
      try {
        const fen = generateFen(state);
        const engineData = await getEngineFen(fen);
        dispatch({ type: "ENGINE_MOVE", payload: engineData });
      } catch (e) {
        // TODO: refactor to toast
        throw e;
      }
    }

    if (isCurrentUserTurn) {
      sendGameDataToSupabase(state, client);
    }

    if (!isCurrentUserTurn) {
      generateEngineMove();
    }
  }, [isCurrentUserTurn, client]);

  useEffect(() => {
    // WS to keep player synced
    // Dont need to update payload when playing vs engine, because state is local
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
