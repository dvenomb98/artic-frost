import {useCherryStore} from "@core/providers/store-provider";
import {FileActionKey} from "./file";
import {toast} from "sonner";

import {
  CHERRY_STORAGE_SCHEMA,
  parsePersistData,
  preparePersistData,
} from "@core/store/persist";
import {getSafeStorageData, setSafeStorageData} from "@/lib/storage/utils";
import {LOCAL_STORAGE_KEYS} from "@/lib/storage/const";

function useFileActions(): Record<FileActionKey, () => void | Promise<void>> {
  const s = useCherryStore(s => s);
  const {resetState, ctx, setDataFromPersist} = s;

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
    SAVE: saveFile,
    LOAD_LATEST: loadFile,
  };
}

export {useFileActions};
