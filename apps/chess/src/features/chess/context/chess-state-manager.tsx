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

import { toast } from "sonner";
import { Button } from "@ui/components";
import { generateFen } from "chess-lite/fen";

import { createClient } from "@/services/supabase/client";
import { sendGameDataToSupabase } from "../api/actions";

import useStockfish from "@/services/stockfish/use-stockfish";
import { EngineConfigValues } from "@/services/stockfish/config";

import { ChessState } from "../store/definitions";
import { ActionType, chessReducer } from "../store/game-reducer";
import { getUserRole } from "../store/utils";

interface ChessContextType {
  state: ChessState;
  isCurrentUserTurn: boolean;
  dispatch: Dispatch<ActionType>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setEngineConfig: Dispatch<SetStateAction<EngineConfigValues>>;
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
    const role = getUserRole(state.currentUserId, state.userWhiteId);
    return role === state.onTurn;
  }, [state.currentUserId, state.userWhiteId, state.onTurn]);

  useEffect(() => {
    // Separate useEffect to handle engine moves
    if (state.type !== "engine") return;

    async function generateEngineMove() {
      try {
        const fen = generateFen(state);
        const payload = await getEngineFen(fen);
        // Sending data to supabase before move to keep state sync
        const nextState = chessReducer(state, { type: "ENGINE_MOVE", payload });
        dispatch({ type: "UPDATE_STATE", payload: nextState });
        await sendGameDataToSupabase(nextState);
      } catch (e) {
        dispatch({ type: "UPDATE_STATE", payload: state });
        toast.error("There was an error during generating engine move.", {
          action: (
            <Button onClick={() => window.location.reload()}>Reload</Button>
          ),
        });
      }
    }

    if (!isCurrentUserTurn && !loading) {
      generateEngineMove();
    }
  }, [isCurrentUserTurn, client, loading]);

  useEffect(() => {
    // WS to keep player synced
    // Dont need to update payload when playing vs engine, because state is local
    if (state.type === "engine") return;

    const channel = client.channel(`game-data-channel`);
    const subscription = channel
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
            payload: payload.new,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [state.id]);

  return (
    <ChessContext.Provider
      value={{
        state,
        dispatch,
        isCurrentUserTurn,
        loading,
        setLoading,
        setEngineConfig,
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
