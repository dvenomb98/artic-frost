import {useCherryStore} from "@/features/core/providers/store-provider";
import {FileActionKey} from "./file";
import {toast} from "sonner";

import {useDialogStore} from "@/store/dialog/dialog-provider";
import {UploadFromUrl} from "./components/upload-from-url";
import {canvasImgFromBlob} from "@/features/core/lib/utils";
import {
  CHERRY_STORAGE_SCHEMA,
  parsePersistData,
  preparePersistData,
} from "@/features/core/store/persist";
import {getSafeStorageData, setSafeStorageData} from "@/lib/storage/utils";
import {LOCAL_STORAGE_KEYS} from "@/lib/storage/const";

function useFileActions(): Record<FileActionKey, () => void | Promise<void>> {
  const s = useCherryStore(s => s);
  const {resetState, ctx, loadImage, setHistory, setDataFromPersist} = s;
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
          try {
            const img = await canvasImgFromBlob(file);
            loadImage(img);
            setHistory();
          } catch (_) {
            toast.error("Failed to load image");
          }
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

  async function saveFile() {
    try {
      const data = await preparePersistData(s);

      setSafeStorageData(
        LOCAL_STORAGE_KEYS.CHERRY_STATE,
        data,
        CHERRY_STORAGE_SCHEMA
      );

      toast.success("Canvas saved.");
    } catch (e) {
      console.error(e);
      toast.error("Saving canvas failed.");
    }
  }

  async function loadFile() {
    try {
      const persistData = getSafeStorageData(
        LOCAL_STORAGE_KEYS.CHERRY_STATE,
        CHERRY_STORAGE_SCHEMA
      );

      if (!persistData) throw new Error("No data found.");

      const data = await parsePersistData(persistData);

      setDataFromPersist(data);
    } catch (e) {
      console.error(e);
      let message = "Loading latest saved state failed: ";
      if (e instanceof Error) message += e.message;
      toast.error(message);
    }
  }

  return {
    NEW: createNewFile,
    DOWNLOAD: downloadFile,
    UPLOAD: uploadFile,
    UPLOAD_FROM_URL: uploadFromUrl,
    SAVE: saveFile,
    LOAD_LATEST: loadFile,
  };
}

export {useFileActions};
