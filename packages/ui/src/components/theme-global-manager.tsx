"use client";
import {useMounted, cn} from "@artic-frost/ui/lib";
import {
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@artic-frost/ui/components";
import {useTheme} from "next-themes";

import {MoonIcon, SunIcon} from "lucide-react";
import {ComponentPropsWithoutRef, forwardRef} from "react";
import {VariantProps} from "class-variance-authority";

const palleteClasses: Record<string, string> = {
  zinc: "bg-slate-700",
  rose: "bg-rose-700",
  violet: "bg-violet-700",
  orange: "bg-orange-700",
  green: "bg-green-700",
};

const palleteClassesArray = Object.entries(palleteClasses).map(
  ([key, value]) => ({key, value})
);

const ColorElement = ({bgColor}: {bgColor: string}) => (
  <div className={cn("w-5 h-5 rounded-full", bgColor)} />
);

interface ThemeGlobalManagerProps {
  align?: ComponentPropsWithoutRef<typeof DropdownMenuContent>["align"];
  side?: ComponentPropsWithoutRef<typeof DropdownMenuContent>["side"];
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  iconClassName?: string;
}

const ThemeGlobalManager = forwardRef<
  HTMLButtonElement,
  ThemeGlobalManagerProps
>(({align, side, buttonVariant, buttonSize, iconClassName}, ref) => {
  const {setTheme, theme} = useTheme();
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
        <DropdownMenuTrigger asChild ref={ref}>
          <Button
            variant={buttonVariant || "outline"}
            size={buttonSize || "icon"}>
            <SunIcon
              className={cn(
                "size-4 scale-100",
                isDark && "scale-0",
                iconClassName
              )}
            />
            <MoonIcon
              className={cn(
                "absolute size-4 scale-0",
                isDark && "scale-100",
                iconClassName
              )}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side={side} align={align || "end"}>
          <div>
            <DropdownMenuItem
              className={cn(
                "p-2",
                !isDark && "bg-accent text-accent-foreground"
              )}
              onClick={() => setThemeMode("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className={cn(
                "p-2",
                isDark && "bg-accent text-accent-foreground"
              )}
              onClick={() => setThemeMode("dark")}>
              Dark
            </DropdownMenuItem>
          </div>
          <div>
            <DropdownMenuSeparator />
            {palleteClassesArray.map(({key, value}) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setThemePallete(key)}
                className={cn("gap-4", currentPallete === key && "bg-accent")}>
                <ColorElement bgColor={value} />
                <p className="first-letter:uppercase">{key}</p>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
});

export {ThemeGlobalManager};
