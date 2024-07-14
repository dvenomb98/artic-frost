"use client";

import React, { createContext, useReducer, ReactNode, Dispatch, useContext } from "react";
import { Board, BoardValue, initialBoard } from "@/chess/lib/board";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";
import { convertFenToBoard, convertFenValuesToState } from "../lib/fen";

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

type EnPassantTargetSquareMove = {
  colIndex: number | null
  rowIndex: number | null
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
  enPassantTargetSquare: EnPassantTargetSquareMove
  gameState: GameState;
  users: ChessUser[];
  fullMoves: number
  halfMoves: number
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
  enPassantTargetSquare: {
    colIndex: null,
    rowIndex: null
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
  fullMoves: 1,
  halfMoves: 0
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
  const fen = convertFenValuesToState("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2")
  console.log(state)
  console.log(fen)

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
  type EnPassantTargetSquareMove,
  type ChessUser,
};
