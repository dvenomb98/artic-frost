import { FC, ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { defaultTheme, themeRegistryArray } from "@ui/theme/registry";
import { Toaster } from "@ui/components/ui/sonner";

interface UiProviderProps {
  children: ReactNode
  toasterProps?: React.ComponentProps<typeof Toaster>
}

const UiProvider: FC<UiProviderProps> = ({ children, toasterProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="turbo-theme"
      disableTransitionOnChange
      defaultTheme={defaultTheme}
      themes={themeRegistryArray}
    >
      {children}
      <Toaster {...toasterProps} />
    </ThemeProvider>
  );
};

export default UiProvider;
