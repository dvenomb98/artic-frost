"use client";
import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import useMounted from "@ui/lib/hooks/useMounted"
import { cn } from "@ui/lib/utils/cn";

const ThemeModeSwitcher: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();
  const isDark = theme?.includes("dark");

  const setThemeMode = (mode: string) => {
    const constructor = theme?.split("-")[0] as string;
    if (mode === "dark") {
      setTheme(`${constructor}-dark`);
      return;
    }
    setTheme(constructor);
  };

  return (
    mounted && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SunIcon className={cn("h-[1.2rem] w-[1.2rem] scale-100", isDark && "scale-0")} />
            <MoonIcon
              className={cn("absolute h-[1.2rem] w-[1.2rem] scale-0", isDark && "scale-100")}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setThemeMode("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setThemeMode("dark")}>Dark</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default ThemeModeSwitcher;