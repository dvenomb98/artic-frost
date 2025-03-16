"use client";

import {handleFormErrors} from "@/lib/forms/errors";
import {
  Alert,
  Button,
  DialogHeader,
  DialogTitle,
  Input,
} from "@artic-frost/ui/components";
import {useState} from "react";
import {z} from "zod";

const URL_SCHEMA = z.string().url();

function UploadFromUrl({onLoad}: {onLoad: (img: HTMLImageElement) => void}) {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const url = formData.get("url");

    const result = URL_SCHEMA.safeParse(url);

    if (!result.success) {
      const error = handleFormErrors(result.error);
      setError(error.message);
      return;
    }

    const img = new Image();
    img.src = result.data;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      onLoad(img);
    };
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload from URL</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Input type="text" name="url" placeholder="Enter URL" required />
        {error && (
          <Alert size="sm" variant="destructiveFilled">
            {error}
          </Alert>
        )}
        <Button className="w-fit" type="submit">
          Upload
        </Button>
      </form>
    </>
  );
}

export {UploadFromUrl};
