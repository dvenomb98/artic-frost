"use client";

import * as React from "react";

import {UiProvider} from "@artic-frost/ui/providers";
import {DialogStoreProvider} from "@/store/dialog/dialog-provider";

const AppProviders: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <>
      <UiProvider toasterProps={{visibleToasts: 1}}>
        <DialogStoreProvider>{children}</DialogStoreProvider>
      </UiProvider>
    </>
  );
};

export {AppProviders};
