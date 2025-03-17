import {useCherryStore} from "@/features/core/providers/store-provider";
import {FileActionKey} from "./file";

import {useDialogStore} from "@/store/dialog/dialog-provider";
import {UploadFromUrl} from "./components/upload-from-url";
import {canvasImgFromBlob} from "@/features/core/lib/utils";

function useFileActions(): Record<FileActionKey, () => void> {
  const {resetState, ctx, loadImage, setHistory} = useCherryStore(s => s);
  const {openDialog, closeAllDialogs} = useDialogStore(s => s);

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

        reader.onload = async _ => {
          const img = await canvasImgFromBlob(file);
          loadImage(img);
          setHistory();
        };

        reader.readAsArrayBuffer(file);
      }
    };

    input.click();
  }

  function uploadFromUrl() {
    openDialog({
      content: (
        <UploadFromUrl
          onLoad={img => {
            loadImage(img);
            setHistory();
            closeAllDialogs();
          }}
        />
      ),
    });
  }

  return {
    NEW: createNewFile,
    DOWNLOAD: downloadFile,
    UPLOAD: uploadFile,
    UPLOAD_FROM_URL: uploadFromUrl,
  };
}

export {useFileActions};
