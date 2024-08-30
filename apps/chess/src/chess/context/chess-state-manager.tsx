"use client";

import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
  useContext,
  useEffect,
  useMemo,
  SetStateAction,
  useState,
} from "react";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";
import { ChessState } from "../lib/definitions";
import { createClient } from "@/lib/supabase/client";
import { generateFen } from "../lib/fen";
import { getCurrentUser } from "../lib/users";
import { RawGameData } from "@/lib/supabase/definitions";
import useStockfish from "@/lib/stockfish/use-stockfish";
import { sendGameDataToSupabase } from "@/lib/supabase/requests/client-only/send-game-data";
import { EngineConfigValues } from "@/lib/stockfish/config";

interface ChessContextType {
  state: ChessState;
  isCurrentUserTurn: boolean;
  dispatch: Dispatch<ActionType>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setEngineConfig: Dispatch<SetStateAction<EngineConfigValues>>
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

interface ChessProviderProps {
  children: ReactNode;
  providedValues: ChessState;
}

function ChessProvider({ children, providedValues }: ChessProviderProps) {
  const [state, dispatch] = useReducer(chessReducer, providedValues);
  const [loading, setLoading] = useState(false);
  const { getEngineFen, setEngineConfig } = useStockfish(
    state.type === "engine",
    "PLAY"
  );

  const client = createClient();

  const isCurrentUserTurn = useMemo(() => {
    const user = getCurrentUser(state.currentUserId, state.users);
    if (!user) return false;
    return user.role === state.onTurn;
  }, [state.currentUserId, state.users, state.onTurn]);

  useEffect(() => {
    // Separate useEffect to handle engine moves
    if (state.type !== "engine") return;

    async function generateEngineMove() {
      try {
        const fen = generateFen(state);
        const payload = await getEngineFen(fen);
        // Sending data to supabase before move to keep state sync
        const nextState = chessReducer(state, { type: "ENGINE_MOVE", payload });
        await sendGameDataToSupabase(nextState);

        dispatch({ type: "UPDATE_STATE", payload: nextState });
      } catch (e) {
        // TODO: refactor to toast
        throw e;
      }
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
        async payload => {
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
    <ChessContext.Provider
      value={{
        state,
        dispatch,
        isCurrentUserTurn,
        loading,
        setLoading,
        setEngineConfig
      }}
    >
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
