import {PlayStoreProvider} from "../store/provider";
import {InitialStoreData} from "../store/store";
import {PlayInner} from "./play-inner";

/**
 * Layout component for the game
 * Responsive for getting initial data from server and rendering the game with correct layout
 *
 */
function Play({initialStoreData}: {initialStoreData: InitialStoreData}) {
  return (
    <PlayStoreProvider initialStoreData={initialStoreData}>
      <PlayInner />
    </PlayStoreProvider>
  );
}

export {Play};
