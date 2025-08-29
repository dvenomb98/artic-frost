"use client";

import * as React from "react";
import {CheckIcon, ClipboardIcon} from "lucide-react";

import {cn} from "../lib/utils";
import {Button, ButtonProps} from "./button";

interface CopyButtonProps extends Omit<ButtonProps, "children"> {
  value: string;
  src?: string;
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value);
}

function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    }
  }, [hasCopied]);

  return (
    <Button
      size="iconMd"
      type="button"
      variant={variant}
      className={cn(className)}
      onClick={async () => {
        await copyToClipboard(value);
        setHasCopied(true);
      }}
      {...props}>
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

export {CopyButton};
