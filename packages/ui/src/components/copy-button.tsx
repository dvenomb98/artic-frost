"use client";

import {CheckIcon, ClipboardIcon} from "lucide-react";

import {cn, useCopyToClipboard} from "../lib";
import {Button, type ButtonProps} from "./button";

interface CopyButtonProps extends Omit<ButtonProps, "children"> {
  value: string;
  src?: string;
}

function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const {isCopied, copyToClipboard} = useCopyToClipboard();
  return (
    <Button
      size="icon"
      type="button"
      variant={variant}
      className={cn(className)}
      onClick={() => copyToClipboard(value)}
      {...props}>
      <span className="sr-only">Copy</span>
      {isCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}

export {CopyButton};
