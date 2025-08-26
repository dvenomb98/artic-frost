import {PlayStoreProvider} from "../store/provider";
import {InitialStoreData} from "../store/store";
import {Board} from "./board";

/**
 * Layout component for the game
 * Responsive for getting initial data from server and rendering the game with correct layout
 *
 */
function Play({initialStoreData}: {initialStoreData: InitialStoreData}) {
  return (
    <PlayStoreProvider initialStoreData={initialStoreData}>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-full">
          {/* Opponent row */}
          <div className="border-b p-4 flex-shrink-0">
            <div>Player 1 row</div>
          </div>

          {/* Board area - takes remaining space and centers board */}
          <div className="flex-1 grid place-items-center p-2">
            <div className="w-full max-w-[min(100vw-2rem,min(100vh-16rem,600px))] aspect-square lg:max-w-[600px] xl:max-w-[800px]">
              <Board />
            </div>
          </div>

          {/* Current player row */}
          <div className="p-4 border-t flex-shrink-0">
            <div>Player 2 row</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-[320px] lg:min-w-[320px] lg:max-w-[600px] border-l border-t p-4">
          <div>Sidebar</div>
        </div>
      </div>
    </PlayStoreProvider>
  );
}

export {Play};
