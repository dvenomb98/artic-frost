import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";
import { defaultTheme, themeRegistryArray } from "@ui/theme/registry";
import { Toaster } from "@ui/components/ui/sonner";

const UiProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="turbo-theme"
      disableTransitionOnChange
      defaultTheme={defaultTheme}
      themes={themeRegistryArray}
    >
      {children}
      <Toaster/>
    </ThemeProvider>
  );
};

export default UiProvider;
