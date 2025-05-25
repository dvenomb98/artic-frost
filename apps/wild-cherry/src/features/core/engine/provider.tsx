"use client";

import * as React from "react";
import {DrawingEngine} from "./engine";
import {useCoreStore, useCoreStoreInstance} from "../store/provider";

const Context = React.createContext<{getEngine: () => DrawingEngine} | null>(
  null
);

function EngineProvider({children}: {children: React.ReactNode}) {
  const storeApi = useCoreStoreInstance();
  const {ctx} = useCoreStore(state => state);
  const engineRef = React.useRef<DrawingEngine>(null);

  function getEngine() {
    if (engineRef.current) {
      return engineRef.current;
    }

    if (!ctx) {
      throw new Error("Canvas context is not initialized");
    }

    engineRef.current = new DrawingEngine(ctx, storeApi);
    return engineRef.current;
  }

  return <Context.Provider value={{getEngine}}>{children}</Context.Provider>;
}

function useEngine() {
  const engine = React.use(Context);

  if (!engine) {
    throw new Error("useEngine must be used within EngineProvider");
  }

  return engine;
}

export {EngineProvider, useEngine};
