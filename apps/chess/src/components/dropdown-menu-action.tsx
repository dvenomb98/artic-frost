import React from "react";
import { DropdownMenuItem } from "@ui/components";
import { useTransition } from "react";

interface DropdownMenuActionProps {
  children: React.ReactNode;
  action: () => Promise<void>;
  icon?: React.ReactNode;
}

export function DropdownMenuAction({ children, action, icon }: DropdownMenuActionProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenuItem
      onSelect={(event) => {
        event.preventDefault();
        startTransition(async () => {
          await action();
        });
      }}
      disabled={isPending}
    >
      <div className="w-full h-full flex gap-2 items-center">
        {icon}
        {isPending ? "Processing..." : children}
      </div>
    </DropdownMenuItem>
  );
}