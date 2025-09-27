import {Database} from "./database-types";

type DbPlayTableRow = Database["public"]["Tables"]["play"]["Row"];
type DbPlayTableRowPlayerKeys = keyof Pick<
  DbPlayTableRow,
  "black_player" | "white_player"
>;

type DbSavesTableRow = Database["public"]["Tables"]["saves"]["Row"];
type DbProfileTableRow = Database["public"]["Tables"]["profiles"]["Row"];

export type {
  DbPlayTableRow,
  DbPlayTableRowPlayerKeys,
  DbSavesTableRow,
  DbProfileTableRow,
};
