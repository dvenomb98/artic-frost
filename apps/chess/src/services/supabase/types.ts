import {Database} from "./database-types";

type DbPlayTableRow = Database["public"]["Tables"]["play"]["Row"];
type DbPlayTableRowPlayerKeys = keyof Pick<
  DbPlayTableRow,
  "black_player" | "white_player"
>;

export type {DbPlayTableRow, DbPlayTableRowPlayerKeys};
