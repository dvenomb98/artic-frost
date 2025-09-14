"use client";

import {AsyncButton} from "@artic-frost/ui/components";
import {Trash2} from "lucide-react";
import {DbSave} from "../lib/types";
import {useLibraryStore} from "../store/provider";
import {useRouter} from "next/navigation";

function DeleteSaveButton({save}: {save: DbSave}) {
  const router = useRouter();

  const {handleDeleteSave} = useLibraryStore(state => ({
    handleDeleteSave: state.handleDeleteSave,
  }));

  async function handleDelete() {
    await handleDeleteSave(save);
    router.refresh();
  }

  return (
    <AsyncButton asyncAction={handleDelete} variant="destructive" size="iconMd">
      <Trash2 className="size-4" />
    </AsyncButton>
  );
}

export {DeleteSaveButton};
