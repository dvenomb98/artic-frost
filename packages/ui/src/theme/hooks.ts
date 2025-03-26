import {useTheme} from "next-themes";

function useThemeVariant() {
  const {theme} = useTheme();

  const variant = theme?.includes("dark") ? "dark" : "light";

  return variant;
}

export {useThemeVariant};
