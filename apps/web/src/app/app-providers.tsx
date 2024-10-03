"use client";

import  { UiProvider } from "@ui/providers";

import React, { FC, PropsWithChildren } from "react";

const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <UiProvider>{children}</UiProvider>
    </>
  );
};

export default AppProviders;
