"use client";

import * as React from "react";
import {createPlayStore, InitialStoreData, PlayStore} from "./store";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";

type PlayStoreApi = ReturnType<typeof createPlayStore>;

const PlayStoreContext = React.createContext<PlayStoreApi | null>(null);

type PlayStoreProviderProps = React.PropsWithChildren<{
  initialStoreData: InitialStoreData;
}>;

/**
 * Provider for the play store.
 * It is used to provide the store to the components.
 * It is also used to create the store if it is not already created.
 *
 */
const PlayStoreProvider = ({
  children,
  initialStoreData,
}: PlayStoreProviderProps) => {
  const storeRef = React.useRef<PlayStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createPlayStore(initialStoreData);
  }

  return (
    <PlayStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayStoreContext.Provider>
  );
};

const usePlayStore = <T,>(selector: (store: PlayStore) => T): T => {
  const playStoreContext = React.use(PlayStoreContext);

  if (!playStoreContext) {
    throw new Error(`usePlayStore must be used within PlayStoreProvider`);
  }

  return useStoreWithEqualityFn(playStoreContext, selector, shallow);
};

export {PlayStoreProvider, usePlayStore};
