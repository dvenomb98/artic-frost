"use client";
import UiProvider from "@repo/ui/providers/ui-provider";
import React, { FC, PropsWithChildren } from "react";


const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider>{children}</UiProvider>
    </>
  );
};

export default AppProviders;
