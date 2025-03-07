import {
  BASE_PRESET,
  BASE_PRESET_CONTENT,
} from "../../packages/ui/src/theme/presets/base-preset";
import type {Config} from "tailwindcss";

const config: Config = {
  presets: [BASE_PRESET],
  content: BASE_PRESET_CONTENT,
};

export default config;
