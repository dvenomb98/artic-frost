import {type DbSavesTableRow} from "@/services/supabase/types";

function getDefaultTitle(save: DbSavesTableRow) {
  return save.title || `Saved Position #${save.id}`;
}

export {getDefaultTitle};
