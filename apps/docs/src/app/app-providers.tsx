"use client";

import  { UiProvider } from "@ui/providers";

import * as React from "react";

const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider>{children}</UiProvider>
    </>
  );
};

export default AppProviders;
