"use client";
import { UiProvider } from "@ui/components";
import React, { FC, PropsWithChildren } from "react";


const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider toasterProps={{visibleToasts: 1}}>{children}</UiProvider>
    </>
  );
};

export default AppProviders;