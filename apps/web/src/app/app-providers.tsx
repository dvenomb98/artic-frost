"use client";

import {UiProvider} from "@artic-frost/ui/providers";

import * as React from "react";

function AppProviders({children}: {children: React.ReactNode}) {
  return (
    <>
      <UiProvider>{children}</UiProvider>
    </>
  );
}

export {AppProviders};
