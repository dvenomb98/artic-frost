import { FC, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { defaultTheme, themeRegistryArray } from "@ui/theme";
import { Toaster } from "@ui/components";

interface UiProviderProps {
  children: ReactNode
  toasterProps?: React.ComponentProps<typeof Toaster>
  themeProviderProps?: Partial<React.ComponentProps<typeof ThemeProvider>>
}

const UiProvider: FC<UiProviderProps> = ({ children, toasterProps, themeProviderProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="turbo-theme"
      disableTransitionOnChange
      defaultTheme={defaultTheme}
      themes={themeRegistryArray}
      {...themeProviderProps}
    >
      {children}
      <Toaster {...toasterProps} />
    </ThemeProvider>
  );
};

export {UiProvider, type UiProviderProps}
