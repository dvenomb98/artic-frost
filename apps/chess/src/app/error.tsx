"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@ui/components";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: log error somewhere
    console.error(error);
  }, [error]);

  return (
    <div className="page--layout space-y-5 grid place-content-center min-h-[60dvh]">
      <section className="bg-destructive p-5 rounded-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <TriangleAlert size={20} className="text-destructive-foreground" />
          <h1 className="h2 text-destructive-foreground">Something went wrong</h1>
        </div>
        <p className="text-destructive-foreground">
          There was an issue processing your request. Please, click button to try again or refresh the page.
        </p>
      </section>

      <Button onClick={reset} className="w-[300px] sm:w-full">
        Try again
      </Button>
    </div>
  );
}
