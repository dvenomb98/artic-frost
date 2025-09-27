"use client";

import * as React from "react";
import {createLibraryStore, LibraryStore} from "./store";

import {useStoreWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";

type LibraryStoreApi = ReturnType<typeof createLibraryStore>;

const LibraryStoreContext = React.createContext<LibraryStoreApi | null>(null);

function LibraryStoreProvider({children}: React.PropsWithChildren) {
  const store = React.useRef<LibraryStoreApi>(null);

  if (!store.current) {
    store.current = createLibraryStore();
  }

  return (
    <LibraryStoreContext.Provider value={store.current}>
      {children}
    </LibraryStoreContext.Provider>
  );
}

const useLibraryStore = <T,>(selector: (store: LibraryStore) => T): T => {
  const libraryStoreContext = React.use(LibraryStoreContext);

  if (!libraryStoreContext) {
    throw new Error(`useLibraryStore must be used within LibraryStoreProvider`);
  }

  return useStoreWithEqualityFn(libraryStoreContext, selector, shallow);
};

export {LibraryStoreProvider, useLibraryStore};
