import { useCherryStore } from "@/features/core/providers/store-provider";
import { FileActionKey } from "./file";
// import { useDialogStore } from "@/store/dialog/dialog-provider";

function useFileActions(): Record<FileActionKey, () => void> {
  const { resetState, ctx } = useCherryStore((s) => s);
  // const { openDialog } = useDialogStore((s) => s);

  function createNewFile() {
    resetState();
  }

  function downloadFile() {
    if (!ctx) return;

    const link = document.createElement("a");
    link.href = ctx.canvas.toDataURL();
    link.download = "canvas.png";
    link.click();
  }

  function uploadFile() {

  }

  function uploadFromUrl() {}

  return {
    NEW: createNewFile,
    DOWNLOAD: downloadFile,
    UPLOAD: uploadFile,
    UPLOAD_FROM_URL: uploadFromUrl,
  };
}

export { useFileActions };
