import {ButtonProps} from "@artic-frost/ui/components";

type UiConfig = {
  BUTTON: {
    VARIANT: ButtonProps["variant"];
    ICON_SIZE: ButtonProps["size"];
    SIZE: ButtonProps["size"];
  };
};

const UI_CONFIG = {
  BUTTON: {
    VARIANT: "outline",
    ICON_SIZE: "icon",
    SIZE: "default",
  },
} as const satisfies UiConfig;

export {UI_CONFIG, type UiConfig};
