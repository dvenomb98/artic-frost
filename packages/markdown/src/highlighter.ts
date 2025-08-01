import {Options} from "rehype-pretty-code";
import {createHighlighter} from "shiki";

const OPTIONS: Options = {
  getHighlighter: options => createHighlighter(options),
  theme: {
    zinc: "github-light-high-contrast",
    "zinc-dark": "github-dark-high-contrast",
    green: "vitesse-light",
    "green-dark": "vitesse-dark",
    violet: "catppuccin-latte",
    "violet-dark": "catppuccin-mocha",
    rose: "vitesse-light",
    "rose-dark": "vitesse-dark",
    orange: "vitesse-light",
    "orange-dark": "vitesse-dark",
  },
};

export {OPTIONS};
