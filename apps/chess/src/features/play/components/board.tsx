"use client";

import {ChessBoard} from "@/components/chess-board";
import {usePlayStore} from "../store/provider";
import {cn} from "@artic-frost/ui/lib";

function Board() {
  const {
    board,
    players,
    handleSquareClick,
    moves,
    isOnTurn,
    opponentConnected,
    selectedSquare,
  } = usePlayStore(state => ({
    board: state.parsedFen.board,
    players: state.players,
    handleSquareClick: state.handleSquareClick,
    moves: state.moves,
    isOnTurn: state.isOnTurn,
    opponentConnected: state.opponentConnected,
    selectedSquare: state.selectedSquare,
  }));

  const readOnly = !isOnTurn || !opponentConnected;

  return (
    <ChessBoard
      board={board}
      isRotated={players.current.value === "Black"}
      onSquareClick={handleSquareClick}
      possibleMoves={moves}
      selectedSquare={selectedSquare}
      readOnly={readOnly}
      className={cn({
        "motion-safe:animate-pulse transition-opacity": !opponentConnected,
      })}
    />
  );
}

export {Board};
