"use client";

import * as React from "react";

import { UiProvider } from "@artic-frost/ui/providers";
import { SidebarProvider } from "@artic-frost/ui/components";

const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider toasterProps={{ visibleToasts: 1 }}>
        <SidebarProvider>{children}</SidebarProvider>
      </UiProvider>
    </>
  );
};

export { AppProviders };
