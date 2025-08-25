import {PlayStoreProvider} from "../store/provider";
import {InitialStoreData} from "../store/store";

/**
 * Layout component for the game
 * Responsive for getting initial data from server and rendering the game with correct layout
 *
 */
function Play({initialStoreData}: {initialStoreData: InitialStoreData}) {
  return (
    <PlayStoreProvider initialStoreData={initialStoreData}>
      <div>Game</div>
      <div>{JSON.stringify(initialStoreData, null, 2)}</div>
    </PlayStoreProvider>
  );
}

export {Play};
