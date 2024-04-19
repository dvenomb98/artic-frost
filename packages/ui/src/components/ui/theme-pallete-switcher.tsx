"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import useMounted from "@ui/lib/hooks/useMounted";
import { cn } from "@ui/lib/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Button } from "@ui/components/ui/button";

const palleteClasses: Record<string, string> = {
  zinc: "bg-slate-700",
  rose: "bg-rose-700",
  violet: "bg-violet-700",
  orange: "bg-orange-700",
  green: "bg-green-700",
};

const palleteClassesArray = Object.entries(palleteClasses).map(([key, value]) => ({ key, value }));

const ColorElement = ({ bgColor }: { bgColor: string }) => (
  <div className={cn("w-5 h-5 rounded-full", bgColor)} />
);

const ThemePalleteSwitcher: FC = () => {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();

  const currentPallete = theme?.split("-")[0] as string;

  const setThemePallete = (key: string) => {
    const isDark = theme?.includes("dark");
    if (isDark) {
      setTheme(`${key}-dark`);
      return;
    }
    setTheme(key);
  };

  return (
    mounted && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ColorElement bgColor={palleteClasses[currentPallete] as string} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {palleteClassesArray.map(({ key, value }) => (
            <DropdownMenuItem key={key} onClick={() => setThemePallete(key)} className="gap-2">
              <ColorElement bgColor={value} />
              <p className="first-letter:uppercase">{key}</p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default ThemePalleteSwitcher;
