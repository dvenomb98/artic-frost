import {DbTagsTableColumn} from "@/services/supabase/types";
import type {GameResult} from "wasm-chess";

/**
 *
 * Save tags translations
 *
 */

const TAGS_VALUES: DbTagsTableColumn[] = [
  "openings",
  "middle_game",
  "end_game",
  "to_study",
] as const;

const TAGS_LABELS_MAP: Record<DbTagsTableColumn, string> = {
  openings: "Openings",
  middle_game: "Middle Game",
  end_game: "End Game",
  to_study: "To Study",
} as const;

function getTranslatedSaveTagLabel(tagValue: string) {
  const isMapped = Object.hasOwn(TAGS_LABELS_MAP, tagValue);

  if (!isMapped) return "Unknown tag";

  return TAGS_LABELS_MAP[tagValue as keyof typeof TAGS_LABELS_MAP];
}

const SAVE_TAGS_OPTIONS = Object.keys(TAGS_LABELS_MAP).map(key => ({
  value: key as DbTagsTableColumn,
  label: getTranslatedSaveTagLabel(key),
}));

/**
 *
 * Game results translations
 *
 */

const RESULTS_MAP: Record<NonNullable<GameResult>, string> = {
  BlackCheckmate: "Black wins by checkmate",
  WhiteCheckmate: "White wins by checkmate",
  Stalemate: "Draw by stalemate",
  InsufficientMaterial: "Draw by insufficient material",
  FiftyMoveRule: "Draw by fifty move rule",
  ThreefoldRepetition: "Draw by threefold repetition",
  WhiteResignation: "White resigns",
  BlackResignation: "Black resigns",
} as const;

function getTranslatedResults(result: GameResult) {
  if (!result) return "Game in progress";
  return RESULTS_MAP[result] || "Unknown result";
}

/**
 *
 * Exports
 *
 */

export {
  TAGS_VALUES,
  SAVE_TAGS_OPTIONS,
  getTranslatedResults,
  getTranslatedSaveTagLabel,
};
