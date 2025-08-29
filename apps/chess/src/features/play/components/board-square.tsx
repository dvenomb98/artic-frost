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
  const {players, handleSquareClick, moves} = usePlayStore(state => ({
    players: state.players,
    isOnTurn: state.isOnTurn,
    handleSquareClick: state.handleSquareClick,
    moves: state.moves,
  }));

  const squareColor =
    (rowIndex + colIndex) % 2 === 0 ? "bg-white" : "bg-muted-foreground";

  const isPossibleMove = moves.some(
    move => move.to_row_idx === rowIndex && move.to_col_idx === colIndex
  );

  const handleClick = () => {
    handleSquareClick(rowIndex, colIndex);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`${piece} on square ${colIndex},${rowIndex}`}
      className={cn(squareColor, "relative", {
        "transform rotate-180": players.current.value === "Black",
      })}>
      <PossibleMoveIndicator show={isPossibleMove} />
      <PieceSVG piece={piece} />
    </button>
  );
}

export {BoardSquare};

function PossibleMoveIndicator({show}: {show: boolean}) {
  return (
    <span
      className={cn(
        "flex size-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        {
          absolute: show,
          hidden: !show,
        }
      )}>
      <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-green-600 opacity-50" />
      <span className="relative inline-flex size-4 rounded-full bg-green-600" />
      <span className="sr-only">Possible move</span>
    </span>
  );
}
