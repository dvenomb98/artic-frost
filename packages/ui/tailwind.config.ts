import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const BREAKPOINTS = {
  SM: {
    MIN: 0,
    MAX: 1024,
  },
  LG: {
    MIN: 1025,
    MAX: 1920,
  },
};

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: { max: `${BREAKPOINTS.SM.MAX}px` },
      lg: `${BREAKPOINTS.LG.MIN}px`,
    },
    container: {
      padding: "2rem",
      center: true,
      screens: {
        sm: { max: `${BREAKPOINTS.SM.MAX}px` },
        lg: `${BREAKPOINTS.LG.MIN}px`,
      },
    },
    fontFamily: {
      sans: ["Inter", ...fontFamily.sans],
    },
    fontWeight: {
      light: "200",
      normal: "400",
      medium: "500",
      bold: "700",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "100",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("./src/lib/plugins/grid-bg")],
};
export default config;



