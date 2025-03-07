import { useCherryStore } from "@/features/core/providers/store-provider";
import { FileActionKey } from "./file";
// import { useDialogStore } from "@/store/dialog/dialog-provider";

function useFileActions(): Record<FileActionKey, () => void> {
  const { resetState, ctx, loadImage } = useCherryStore(s => s);
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
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = e => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = _ => {
          const img = new Image();

          img.onload = () => {
            loadImage(img);
          };

          img.src = URL.createObjectURL(file);
        };

        reader.readAsDataURL(file);
      }
    };

    input.click();
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
