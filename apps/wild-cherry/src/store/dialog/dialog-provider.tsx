"use client";

import {type ReactNode, createContext, useRef, use} from "react";
import {useStore} from "zustand";

import {createDialogStore, type DialogStore} from "./store";
import {GlobalDialog} from "./global-dialog";

type DialogStoreApi = ReturnType<typeof createDialogStore>;

const DialogStoreContext = createContext<DialogStoreApi | null>(null);

type DialogStoreProviderProps = {
  children: ReactNode;
};

const DialogStoreProvider = ({children}: DialogStoreProviderProps) => {
  const storeRef = useRef<DialogStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createDialogStore();
  }

  return (
    <DialogStoreContext.Provider value={storeRef.current}>
      <GlobalDialog />
      {children}
    </DialogStoreContext.Provider>
  );
};

const useDialogStore = <T,>(selector: (store: DialogStore) => T): T => {
  const dialogStoreContext = use(DialogStoreContext);

  if (!dialogStoreContext) {
    throw new Error(`useDialogStore must be used within DialogStoreProvider`);
  }

  return useStore(dialogStoreContext, selector);
};

export {DialogStoreProvider, useDialogStore};
