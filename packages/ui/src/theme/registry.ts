const themeRegistryMap = {
    zinc: "zinc",
    zinc_dark: "zinc-dark",
    rose: "rose",
    rose_dark: "rose-dark",
    violet: "violet",
    violet_dark: "violet-dark",
    orange: "orange",
    orange_dark: "orange-dark",
    green: "green",
    green_dark: "green-dark"
  };
  
  const themeRegistryArray = Object.values(themeRegistryMap).map((value) => value);
  
  const defaultTheme = "zinc-dark";

  export { themeRegistryArray, themeRegistryMap, defaultTheme }