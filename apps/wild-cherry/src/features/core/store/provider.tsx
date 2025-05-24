"use client";

import * as React from "react";

import {useStore} from "zustand";

import {type CoreStore, createCoreStore} from "./store";

type CoreStoreApi = ReturnType<typeof createCoreStore>;

const CoreStoreContext = React.createContext<CoreStoreApi | null>(null);

type CoreStoreProviderProps = {
  children: React.ReactNode;
};

const CoreStoreProvider = ({children}: CoreStoreProviderProps) => {
  const storeRef = React.useRef<CoreStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createCoreStore();
  }

  return (
    <CoreStoreContext.Provider value={storeRef.current}>
      {children}
    </CoreStoreContext.Provider>
  );
};

const useCoreStore = <T,>(selector: (store: CoreStore) => T): T => {
  const coreStoreContext = React.use(CoreStoreContext);

  if (!coreStoreContext) {
    throw new Error(`useCoreStore must be used within CoreStoreProvider`);
  }

  return useStore(coreStoreContext, selector);
};

const useCoreStoreInstance = (): CoreStoreApi => {
  const coreStoreContext = React.use(CoreStoreContext);

  if (!coreStoreContext) {
    throw new Error(`useCoreStoreApi must be used within CoreStoreProvider`);
  }

  return coreStoreContext;
};

export {CoreStoreProvider, useCoreStore, useCoreStoreInstance};
