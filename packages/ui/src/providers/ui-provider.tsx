import {ReactNode} from "react";
import {ThemeProvider, ThemeProviderProps} from "next-themes";
import {defaultTheme, themeRegistryArray} from "@artic-frost/ui/theme";
import {Toaster} from "@artic-frost/ui/components";
import {ToasterProps} from "sonner";

interface UiProviderProps {
  children: ReactNode;
  toasterProps?: ToasterProps;
  themeProviderProps?: Partial<ThemeProviderProps>;
}

const UiProvider = ({
  children,
  toasterProps,
  themeProviderProps,
}: UiProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      storageKey="turbo-theme"
      disableTransitionOnChange
      defaultTheme={defaultTheme}
      themes={themeRegistryArray}
      {...themeProviderProps}>
      {children}
      <Toaster {...toasterProps} />
    </ThemeProvider>
  );
};

export {UiProvider, type UiProviderProps};
