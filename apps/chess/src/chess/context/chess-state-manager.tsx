"use client";

import React, { createContext, useReducer, ReactNode, Dispatch, useContext } from "react";
import { Board, BoardValue, initialBoard } from "@/chess/lib/board";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";

interface SelectedPiece {
  rowIndex: number | null;
  colIndex: number | null;
  piece: BoardValue | null;
}

type OnTurn = "WHITE" | "BLACK";

type CastleAbility = Record<OnTurn, { short: boolean; long: boolean }>;

type LastMove = {
  startRowIndex: number | null;
  startColIndex: number | null;
  endRowIndex: number | null;
  endColIndex: number | null;
  piece: string | null;
};

interface PossibleMoves {
  rowIndex: number;
  colIndex: number;
  isCastle: boolean
  isEnPassant: boolean
}

// Define the state type
interface ChessState {
  boardState: Board;
  selectedPiece: SelectedPiece;
  possibleMoves: PossibleMoves[];
  onTurn: OnTurn;
  castleAbility: CastleAbility;
  lastMove: LastMove
}

// Define initial state
const initialState: ChessState = {
  boardState: initialBoard,
  selectedPiece: { rowIndex: null, colIndex: null, piece: null },
  possibleMoves: [],
  castleAbility: {
    WHITE: {
      short: true,
      long: true,
    },
    BLACK: {
      short: true,
      long: true,
    },
  },
  lastMove: {
    startColIndex: null,
    startRowIndex: null,
    endRowIndex: null,
    endColIndex: null,
    piece: null
  },
  onTurn: "WHITE",
};

// Define context type
interface ChessContextType {
  state: ChessState;
  dispatch: Dispatch<ActionType>;
}

// Create context
const ChessContext = createContext<ChessContextType | undefined>(undefined);

// Create provider component
interface ChessProviderProps {
  children: ReactNode;
}

function ChessProvider({ children }: ChessProviderProps) {
  const [state, dispatch] = useReducer(chessReducer, initialState);
  console.log(state)

  return <ChessContext.Provider value={{ state, dispatch }}>{children}</ChessContext.Provider>;
}

// Custom hook to use chess context
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
  type ChessState,
  type SelectedPiece,
  type PossibleMoves,
  type OnTurn,
  type CastleAbility,
  type LastMove
};
