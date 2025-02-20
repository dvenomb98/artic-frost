"use client";

import * as React from "react";

import { UiProvider } from "@artic-frost/ui/providers";


const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider toasterProps={{ visibleToasts: 1 }}>
        {children}
      </UiProvider>
    </>
  );
};

export { AppProviders };
