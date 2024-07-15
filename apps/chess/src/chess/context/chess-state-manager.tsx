"use client";

import React, { createContext, useReducer, ReactNode, Dispatch, useContext } from "react";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";
import { ChessState, initialState } from "../lib/definitions";

interface ChessContextType {
  state: ChessState;
  dispatch: Dispatch<ActionType>;
}

const ChessContext = createContext<ChessContextType | undefined>(undefined);

interface ChessProviderProps {
  children: ReactNode;
}

function ChessProvider({ children }: ChessProviderProps) {
  const [state, dispatch] = useReducer(chessReducer, initialState);
  // const fen = generateFen(state)
  // const board = parseFen(fen)
  // console.log(fen)
  // console.log(board)

  // send to supabase here 

  return <ChessContext.Provider value={{ state, dispatch }}>{children}</ChessContext.Provider>;
}

function useChessManager(): ChessContextType {
  const context = useContext(ChessContext);
  if (context === undefined) {
    throw new Error("useChessManager must be used within a ChessProvider");
  }
  return context;
}

export {
  ChessProvider,
  useChessManager,
};
