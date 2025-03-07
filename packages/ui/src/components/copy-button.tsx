"use client";

import * as React from "react";
import {DropdownMenuTriggerProps} from "@radix-ui/react-dropdown-menu";
import {CheckIcon, ClipboardIcon} from "lucide-react";

import {cn} from "@artic-frost/ui/lib";
import {Button, ButtonProps} from "@artic-frost/ui/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

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
      size="icon"
      variant={variant}
      className={cn("relative z-10 h-6 w-6 [&_svg]:size-3", className)}
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

interface CopyNpmCommandButtonProps extends DropdownMenuTriggerProps {
  commands: Required<any>;
}

export function CopyNpmCommandButton({
  commands,
  className,
}: CopyNpmCommandButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  const copyCommand = React.useCallback((value: string) => {
    copyToClipboard(value);
    setHasCopied(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn("relative z-10 h-6 w-6 [&_svg]:size-3", className)}>
          {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
          <span className="sr-only">Copy</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => copyCommand(commands.__npmCommand__)}>
          npm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__yarnCommand__)}>
          yarn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__pnpmCommand__)}>
          pnpm
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyCommand(commands.__bunCommand__)}>
          bun
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export {CopyButton};
