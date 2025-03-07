"use client";

import {ROUTES} from "@/lib/routes";
import {UiProvider} from "@artic-frost/ui/providers";
import {usePathname} from "next/navigation";
import React, {FC, PropsWithChildren} from "react";

const FORCED_THEMES_MAP = {
  [ROUTES.INDEX]: "zinc-dark",
};

const AppProviders: FC<PropsWithChildren> = ({children}) => {
  const pathname = usePathname();
  return (
    <>
      <UiProvider
        themeProviderProps={{
          forcedTheme:
            FORCED_THEMES_MAP[pathname as keyof typeof FORCED_THEMES_MAP] ||
            undefined,
        }}
        toasterProps={{visibleToasts: 1}}>
        {children}
      </UiProvider>
    </>
  );
};

export default AppProviders;
