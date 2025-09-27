import {DbSavesTableRow} from "@/services/supabase/types";

type DbSave = Omit<DbSavesTableRow, "user_id">;

export type {DbSave};
