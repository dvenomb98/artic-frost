"use client";
import useMounted from "@ui/lib/hooks/useMounted";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@ui/lib/utils/cn";

const palleteClasses: Record<string, string> = {
  zinc: "bg-slate-700",
  rose: "bg-rose-700",
  violet: "bg-violet-700",
  orange: "bg-orange-700",
  green: "bg-green-700",
};

const palleteClassesArray = Object.entries(palleteClasses).map(
  ([key, value]) => ({ key, value })
);

const ColorElement = ({ bgColor }: { bgColor: string }) => (
  <div className={cn("w-5 h-5 rounded-full", bgColor)} />
);

function ThemeGlobalManager() {
  const { setTheme, theme } = useTheme();
  const mounted = useMounted();
  const isDark = theme?.includes("dark");
  const currentPallete = theme?.split("-")[0] as string;

  const setThemeMode = (mode: string) => {
    const constructor = theme?.split("-")[0] as string;
    if (mode === "dark") {
      setTheme(`${constructor}-dark`);
      return;
    }
    setTheme(constructor);
  };

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
            <SunIcon
              className={cn(
                "h-[1.2rem] w-[1.2rem] scale-100",
                isDark && "scale-0"
              )}
            />
            <MoonIcon
              className={cn(
                "absolute h-[1.2rem] w-[1.2rem] scale-0",
                isDark && "scale-100"
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div>
            <DropdownMenuItem
              className={cn(
                "p-4",
                !isDark && "bg-accent text-accent-foreground"
              )}
              onClick={() => setThemeMode("light")}
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                "p-4",
                isDark && "bg-accent text-accent-foreground"
              )}
              onClick={() => setThemeMode("dark")}
            >
              Dark
            </DropdownMenuItem>
          </div>
          <div>
            <DropdownMenuSeparator />
            {palleteClassesArray.map(({ key, value }) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setThemePallete(key)}
                className={cn("gap-4", currentPallete === key && "bg-accent")}
              >
                <ColorElement bgColor={value} />
                <p className="first-letter:uppercase">{key}</p>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}

export { ThemeGlobalManager };
