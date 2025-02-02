"use client";
import { Button } from "@ui/components";
import { LockIcon } from "lucide-react";
import { toast } from "sonner";

function PageUnauthorized() {
    
  function not_available() {
    toast.info("This feature is not available now. We will ship soon!");
  }

  return (
    <div className="h-full w-full bg-muted/20 grid place-content-center">
      <div className="flex items-center justify-center flex-col gap-4 border rounded-md p-10 bg-card">
        <LockIcon size={100} className="text-muted-foreground" />
        <p className="max-w-[250px] text-center h4">
          This feature is only available for <strong>non-anonymous</strong>{" "}
          users.
        </p>
        <Button onClick={not_available}>
          Convert your account
        </Button>
      </div>
    </div>
  );
}
export { PageUnauthorized };
