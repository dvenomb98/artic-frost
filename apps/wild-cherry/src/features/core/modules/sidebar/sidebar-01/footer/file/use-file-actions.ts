import { useCherryStore } from "@/features/core/providers/store-provider";
import { FileActionKey } from "./file";

function useFileActions(): Record<FileActionKey, () => void> {
    const { resetState } = useCherryStore((s) => s);

    function createNewFile() {
        resetState();
    }

    function downloadFile() {
    }

    function uploadFile() {
    }

    function uploadFromUrl() {
    }

    return {
        NEW: createNewFile,
        DOWNLOAD: downloadFile,
        UPLOAD: uploadFile,
        UPLOAD_FROM_URL: uploadFromUrl,
    };
}

export { useFileActions };
