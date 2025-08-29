import {ChessBoardLayout} from "@/components/chess-board";
import {Board} from "./board";
import {PlayerRow} from "./player-row";
import {Sidebar} from "./sidebar";

function PlayLayout() {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full">
        {/* Opponent row */}
        <div className="border-b p-4 flex-shrink-0">
          <PlayerRow type="opponent" />
        </div>

        {/* Board area - takes remaining space and centers board */}
        <div className="flex-1 grid place-items-center p-2">
          <ChessBoardLayout>
            <Board />
          </ChessBoardLayout>
        </div>

        {/* Current player row */}
        <div className="p-4 border-t flex-shrink-0">
          <PlayerRow type="current" />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-[320px] lg:min-w-[320px] lg:max-w-[600px] border-l border-t">
        <Sidebar />
      </div>
    </div>
  );
}

export {PlayLayout};
