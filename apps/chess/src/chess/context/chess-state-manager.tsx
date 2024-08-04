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
import { Tables } from "@/utils/supabase/tables";
import { generateFen, convertMoveHistoryToString } from "../lib/fen";
import { getCurrentUser } from "../lib/users";
import { RawGameData } from "@/utils/supabase/definitions";

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
  console.log(state)
  const client = createClient();

  const isCurrentUserTurn = useMemo(() => {
    const user = getCurrentUser(state.currentUserId, state.users);
    if (!user) return false;
    return user.role === state.onTurn;
  }, [state.currentUserId, state.users, state.onTurn]);

  useEffect(() => {
    // Sending data to supabase
    // Based on half moves value as it indicates that player finished his turn

    async function sendDataToSupabase() {
      // Dont need to send a first payload, as the player didnt finish his first round yet
      // Only current user should send payload
      if (!state.halfMoves || isCurrentUserTurn) return;

      const fen = generateFen(state);
      const movesHistory = convertMoveHistoryToString(state.movesHistory)

      // Only send a mutable values, as others will not change/are not needed
      const data = {
        fen,
        gameState: state.gameState,
        movesHistory,
        winnerId: state.winnerId
      };

      const { error } = await client.from(Tables.GAMES_DATA).update(data).eq("id", state.id);

      if (error) {
        console.error(error);
        return;
      }
    }

    sendDataToSupabase();
  }, [state.halfMoves, client, isCurrentUserTurn]);

  useEffect(() => {
    const subscription = client
      .channel("public:GAMES_DATA")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "GAMES_DATA", filter: `id=eq.${state.id}` },
        async (payload) => {
          dispatch({ type: "UPDATE_PAYLOAD", payload: payload.new as RawGameData });
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
