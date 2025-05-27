"use client";

import {Button} from "@artic-frost/ui/components";
import {UI_CONFIG} from "./const";

function UiButton({
  children,
  ...props
}: {children: React.ReactNode} & React.ComponentProps<typeof Button>) {
  return (
    <Button variant="ghost" size={UI_CONFIG.BUTTON_SIZE} {...props}>
      {children}
    </Button>
  );
}

export {UiButton};
