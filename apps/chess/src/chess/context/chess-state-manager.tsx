"use client";

import React, { createContext, useReducer, ReactNode, Dispatch, useContext } from "react";
import { Board, BoardValue, initialBoard } from "@/chess/lib/board";
import { ActionType, chessReducer } from "@/chess/lib/game-reducer";
import { generateFen, parseFen} from "../lib/fen";

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
  colIndex: number | null;
  rowIndex: number | null;
};
interface PossibleMoves {
  rowIndex: number;
  colIndex: number;
  isCastle: boolean;
  isEnPassant: boolean;
}

interface FenState {
  castleAbility: CastleAbility;
  enPassantTargetSquare: EnPassantTargetSquareMove;
  onTurn: OnTurn;
  fullMoves: number;
  halfMoves: number;
}

interface FenBoardState extends FenState {
  boardState: Board
}

interface ChessState extends FenState {
  boardState: Board;
  selectedPiece: SelectedPiece;
  possibleMoves: PossibleMoves[];
  gameState: GameState;
  users: ChessUser[];
}

const initialState: ChessState = {
  boardState: initialBoard,
  selectedPiece: { rowIndex: null, colIndex: null, piece: null },
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
    rowIndex: null,
  },
  onTurn: "WHITE",
  fullMoves: 1,
  halfMoves: 0,
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
  // const fen = generateFen(state)
  // const board = parseFen(fen)
  // console.log(fen)
  // console.log(board)

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
  type FenBoardState,
  type FenState
};
