"use client";

import {AsyncButton} from "@artic-frost/ui/components";
import {Trash2} from "lucide-react";
import {DbSavesTableRow} from "@/services/supabase/types";
import {useLibraryStore} from "../store/provider";
import {useRouter} from "next/navigation";
import {UI_CONFIG} from "@/lib/ui-config";

function DeleteSaveButton({save}: {save: DbSavesTableRow}) {
  const router = useRouter();

  const {handleDeleteSave} = useLibraryStore(state => ({
    handleDeleteSave: state.handleDeleteSave,
  }));

  async function handleDelete() {
    await handleDeleteSave(save);
    router.refresh();
  }

  return (
    <AsyncButton
      asyncAction={handleDelete}
      variant={UI_CONFIG.BUTTON.VARIANT}
      size={UI_CONFIG.BUTTON.ICON_SIZE}>
      <Trash2 />
    </AsyncButton>
  );
}

export {DeleteSaveButton};
