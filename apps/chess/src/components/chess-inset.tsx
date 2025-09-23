import {NestedSidebar} from "@/features/sidebar/nested-sidebar";
import {ChessBoardLayout} from "./chess-board";

type ChessContainerProps = {
  upperRow?: React.ReactNode;
  bottomRow?: React.ReactNode;
  sidebar: React.ReactNode;
  board: React.ReactNode;
};

/**
 * ChessInset is a component that wraps the chess board and the sidebar in a container.
 * It is used to create a chess game layout.
 */
function ChessInset({
  upperRow,
  bottomRow,
  sidebar,
  board,
}: ChessContainerProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full max-h-svh">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Opponent row */}
        {upperRow && (
          <div className="border-b p-4 flex-shrink-0 h-14">{upperRow}</div>
        )}

        {/* Board area - takes remaining space and centers board */}
        <div className="flex-1 grid place-items-center p-2">
          <ChessBoardLayout>{board}</ChessBoardLayout>
        </div>

        {/* Current player row */}
        {bottomRow && (
          <div className="p-4 border-t flex-shrink-0 h-14">{bottomRow}</div>
        )}
      </div>

      {/* Sidebar */}
      <NestedSidebar>{sidebar}</NestedSidebar>
    </div>
  );
}

export {ChessInset};
