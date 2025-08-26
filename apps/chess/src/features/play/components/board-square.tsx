import {PieceSVG} from "@/components/chess-piece";
import {cn} from "@artic-frost/ui/lib";
import {type PieceType} from "wasm-chess";
import {usePlayStore} from "../store/provider";

function BoardSquare({
  piece,
  colIndex,
  rowIndex,
}: {
  piece: PieceType | null;
  colIndex: number;
  rowIndex: number;
}) {
  const {currentPlayer, handleSquareClick, moves, selectedSquare} =
    usePlayStore(state => ({
      currentPlayer: state.currentPlayer,
      isOnTurn: state.isOnTurn,
      handleSquareClick: state.handleSquareClick,
      moves: state.moves,
      selectedSquare: state.selectedSquare,
    }));

  const squareColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-muted-foreground";

  const isPossibleMove = moves.some(
    move => move.to_row_idx === rowIndex && move.to_col_idx === colIndex
  );

  const isSquareSelected =
    selectedSquare &&
    selectedSquare.row === rowIndex &&
    selectedSquare.col === colIndex;

  const handleClick = () => {
    handleSquareClick(rowIndex, colIndex);
  };

  return (
    <button
      onClick={() => handleSquareClick(rowIndex, colIndex)}
      aria-label={`${piece} on square ${colIndex},${rowIndex}`}
      className={cn(squareColor, "relative", {
        "transform rotate-180": currentPlayer === "Black"
      })}>
      <PossibleMoveIndicator show={isPossibleMove} />
      <PieceSVG className="text-green-500" piece={piece} />
    </button>
  );
}

export {BoardSquare};

function PossibleMoveIndicator({show}: {show: boolean}) {
  return (
    <span
      className={cn(
        "flex size-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        {
          absolute: show,
          hidden: !show,
        }
      )}>
      <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-green-600 opacity-50" />
      <span className="relative inline-flex size-6 rounded-full bg-green-600" />
      <span className="sr-only">Possible move</span>
    </span>
  );
}
