"use client";

import {PieceSVG} from "@/components/chess-piece";
import {cn} from "@artic-frost/ui/lib";
import {type PieceType, type Moves} from "wasm-chess";

type ChessBoardProps = {
  /**
   * 8x8 board data with pieces
   */
  board: (PieceType | null)[][];

  /**
   * Whether to rotate the board (for black player perspective)
   */
  isRotated?: boolean;

  /**
   * Handler for square clicks
   */
  onSquareClick?: (rowIndex: number, colIndex: number) => void;

  /**
   * Array of possible moves to highlight
   */
  possibleMoves?: Moves;

  /**
   * Whether board interactions are disabled
   */
  disabled?: boolean;

  /**
   * Additional CSS classes for the board container
   */
  className?: string;
};

/**
 * Generic chess board component that renders an 8x8 chess board.
 * All game logic is handled through props, making this component reusable
 * for different chess implementations (play, analysis, puzzles, etc.).
 */
function ChessBoard({
  board,
  isRotated = false,
  onSquareClick,
  possibleMoves = [],
  disabled = false,
  className,
}: ChessBoardProps) {
  const handleSquareClick = (rowIndex: number, colIndex: number) => {
    if (!disabled && onSquareClick) {
      onSquareClick(rowIndex, colIndex);
    }
  };

  const isPossibleMove = (rowIndex: number, colIndex: number) => {
    return possibleMoves.some(
      move => move.to_row_idx === rowIndex && move.to_col_idx === colIndex
    );
  };

  return (
    <section
      className={cn(
        "grid grid-cols-8 grid-rows-8",
        {
          "transform rotate-180": isRotated,
        },
        className
      )}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <ChessBoardSquare
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            rowIndex={rowIndex}
            colIndex={colIndex}
            isPossibleMove={isPossibleMove(rowIndex, colIndex)}
            onClick={() => handleSquareClick(rowIndex, colIndex)}
            disabled={disabled}
            isRotated={isRotated}
          />
        ))
      )}
    </section>
  );
}

function ChessBoardLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[min(100vw-2rem,min(100vh-16rem,600px))] aspect-square lg:max-w-[600px] 2xl:max-w-[800px]",
        className
      )}>
      {children}
    </div>
  );
}

export {type ChessBoardProps, ChessBoard, ChessBoardLayout};

type ChessBoardSquareProps = {
  piece: PieceType | null;
  rowIndex: number;
  colIndex: number;
  isPossibleMove: boolean;
  onClick: () => void;
  disabled: boolean;
  isRotated: boolean;
};

function ChessBoardSquare({
  piece,
  rowIndex,
  colIndex,
  isPossibleMove,
  onClick,
  disabled,
  isRotated,
}: ChessBoardSquareProps) {
  const squareColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-muted-foreground";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={`${piece || "empty"} on square ${colIndex},${rowIndex}`}
      className={cn(squareColor, "relative aspect-square", {
        "transform rotate-180": isRotated,
        "cursor-pointer hover:brightness-110": !disabled,
        "cursor-not-allowed opacity-50": disabled,
      })}>
      {isPossibleMove && <PossibleMoveIndicator />}
      <PieceSVG
        piece={piece}
        className={cn({
          "transform rotate-180": isRotated,
        })}
      />
    </button>
  );
}

function PossibleMoveIndicator() {
  return (
    <span className="flex size-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-green-600 opacity-50" />
      <span className="relative inline-flex size-4 rounded-full bg-green-600" />
      <span className="sr-only">Possible move</span>
    </span>
  );
}
