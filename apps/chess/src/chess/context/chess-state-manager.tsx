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

type GameState = "WAITING_FOR_PLAYERS" | "IN_GAME" | "CHECKMATE" | "DRAW";
interface ChessUser {
  role: OnTurn;
  id: string | null;
}

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
  isCastle: boolean;
  isEnPassant: boolean;
}

interface ChessState {
  boardState: Board;
  selectedPiece: SelectedPiece;
  possibleMoves: PossibleMoves[];
  onTurn: OnTurn;
  castleAbility: CastleAbility;
  lastMove: LastMove;
  gameState: GameState;
  users: ChessUser[];
}

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
    piece: null,
  },
  onTurn: "WHITE",
  gameState: "WAITING_FOR_PLAYERS",
  users: [
    {
      role: "WHITE",
      id: null,
    },
    {
      role: "BLACK",
      id: null,
    },
  ],
};

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
  console.log(state);

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
  type ChessState,
  type SelectedPiece,
  type PossibleMoves,
  type OnTurn,
  type CastleAbility,
  type LastMove,
  type ChessUser,
};
