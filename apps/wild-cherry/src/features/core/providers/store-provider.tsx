"use client";

import {type ReactNode, createContext, useRef, use} from "react";
import {useStore} from "zustand";

import {type CherryStore, createCherryStore} from "../store/store";

type CherryStoreApi = ReturnType<typeof createCherryStore>;

const CherryStoreContext = createContext<CherryStoreApi | null>(null);

type CherryStoreProviderProps = {
  children: ReactNode;
};

const CherryStoreProvider = ({children}: CherryStoreProviderProps) => {
  const storeRef = useRef<CherryStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createCherryStore();
  }

  return (
    <CherryStoreContext.Provider value={storeRef.current}>
      {children}
    </CherryStoreContext.Provider>
  );
};

const useCherryStore = <T,>(selector: (store: CherryStore) => T): T => {
  const cherryStoreContext = use(CherryStoreContext);

  if (!cherryStoreContext) {
    throw new Error(`useCherryStore must be used within CherryStoreProvider`);
  }

  return useStore(cherryStoreContext, selector);
};

export {CherryStoreProvider, useCherryStore};
