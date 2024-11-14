"use client";

import * as React from "react";

import {
  INITIAL_GAME_RESULT,
  type Move,
  type FenState,
  type GameResult,
  type Square,
} from "chess-lite/definitions";

import { INITIAL_FEN_POSITION, parseFen } from "chess-lite/fen";

import { getValidatedMoves, move, getGameResult } from "chess-lite/api";
import { isWhitePiece } from "chess-lite/lib/board";

// Use your own utility for merging classes
// cn is from shadcn/ui
import { cn } from "@ui/lib";


type ChessAppState = {
  game: FenState;
  possibleMoves: Move[];
  gameResult: GameResult;
  selectedPiece: Square | null;
  view: "board" | "json";
};

function ExampleReactChessApp() {
  const [gameState, setGameState] = React.useState<ChessAppState>({
    game: parseFen(INITIAL_FEN_POSITION),
    possibleMoves: [],
    gameResult: INITIAL_GAME_RESULT,
    selectedPiece: null,
    view: "board",
  });

  function onSquareClick(payload: Square) {
    const { colIndex, rowIndex } = payload;
    const selectedMove = gameState.possibleMoves?.find(
      val => val.colIndex === colIndex && val.rowIndex === rowIndex
    );

    if (selectedMove) {
      const nextFenState = move(gameState.game, selectedMove);
      const nextResult = getGameResult(nextFenState);

      setGameState(prev => ({
        ...prev,
        game: nextFenState,
        gameResult: nextResult,
        possibleMoves: [],
        selectedPiece: null,
      }));
      return;
    }
    const moves = getValidatedMoves(gameState.game, payload);
    setGameState(prev => ({
      ...prev,
      selectedPiece: payload,
      possibleMoves: moves,
    }));
  }

  function resetGame() {
    setGameState({
      game: parseFen(INITIAL_FEN_POSITION),
      possibleMoves: [],
      gameResult: INITIAL_GAME_RESULT,
      selectedPiece: null,
      view: "board",
    });
  }

  const setView = (view: "board" | "json") => {
    setGameState(prev => ({ ...prev, view }));
  };

  return (
    <section className="flex gap-4 flex-col max-w-md">
      <div className="flex gap-2">
        <button
          className={cn("text-muted-foreground", {
            underline: gameState.view === "board",
          })}
          onClick={() => setView("board")}
        >
          Board
        </button>
        <button
          className={cn("text-muted-foreground", {
            underline: gameState.view === "json",
          })}
          onClick={() => setView("json")}
        >
          JSON
        </button>
        <button className="text-muted-foreground ml-auto" onClick={resetGame}>
          Reset
        </button>
      </div>

      {gameState.view === "board" && (
        <div className="grid grid-cols-8 grid-rows-8 aspect-square">
          {gameState.game.board.map((row, rowIndex) =>
            row.map((piece, colIndex) => (
              <Square
                key={`${colIndex}-${rowIndex}`}
                {...{ colIndex, rowIndex, piece }}
                onSquareClick={() =>
                  onSquareClick({ colIndex, rowIndex, piece })
                }
                gameState={gameState}
              />
            ))
          )}
        </div>
      )}
      {gameState.view === "json" && (
        <GameJsons
          {...{
            game: gameState.game,
            gameResult: gameState.gameResult,
            possibleMoves: gameState.possibleMoves,
            selectedPiece: gameState.selectedPiece,
          }}
        />
      )}
    </section>
  );
}

function Square({
  colIndex,
  rowIndex,
  piece,
  onSquareClick,
  gameState,
}: Square & {
  onSquareClick: () => void;
  gameState: ChessAppState
}) {
  const squareColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-muted" : "bg-muted-foreground";

  const { possibleMoves, gameResult, game, selectedPiece } = gameState;

  const isSelected =
    selectedPiece?.piece === piece &&
    selectedPiece?.colIndex === colIndex &&
    selectedPiece?.rowIndex === rowIndex;

  const isPossibleMove = possibleMoves.some(
    val => val.colIndex === colIndex && val.rowIndex === rowIndex
  );

  function getDisabled() {
    if (!!gameResult.gameState) return true;

    const isOwnPiece =
      game.onTurn === "WHITE" ? isWhitePiece(piece) : !isWhitePiece(piece);
    const isOpponentPiece = !!piece && !isOwnPiece;

    if (isOpponentPiece) return !isPossibleMove;

    return isOpponentPiece && !isPossibleMove;
  }

  const disabled = getDisabled();

  return (
    <button
      className={cn(squareColor, "p-2 font-medium text-xs", {
        "border-rose-600 border-2": isSelected,
        "border-green-600 border-2": isPossibleMove,
        "cursor-default": disabled,
      })}
      onClick={onSquareClick}
      disabled={disabled}
    >
      {piece}
    </button>
  );
}

function GameJsons({
  game,
  gameResult,
  possibleMoves,
  selectedPiece,
}: {
  game: FenState;
  gameResult: GameResult;
  possibleMoves: Move[];
  selectedPiece: Square | null;
}) {
  return (
    <div className="w-full">
      <p>Game</p>
      <span className="text-muted-foreground text-xs">
        {JSON.stringify(game, null, 2)}
      </span>
      <p>GameResult</p>
      <span className="text-muted-foreground text-xs">
        {JSON.stringify(gameResult, null, 2)}
      </span>
      <p>PossibleMoves</p>
      <span className="text-muted-foreground text-xs">
        {JSON.stringify(possibleMoves, null, 2)}
      </span>
      <p>SelectedPiece</p>
      <span className="text-muted-foreground text-xs">
        {JSON.stringify(selectedPiece, null, 2)}
      </span>
    </div>
  );
}

export { ExampleReactChessApp };
