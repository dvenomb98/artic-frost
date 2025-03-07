import {Options} from "rehype-pretty-code";
import {createHighlighter} from "shiki";

const options: Options = {
  getHighlighter: async options => {
    const highlighter = await createHighlighter(options);
    return highlighter;
  },
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

export {options};
