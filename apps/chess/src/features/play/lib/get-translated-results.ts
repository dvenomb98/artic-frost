import type {GameResult} from "wasm-chess";

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

export {getTranslatedResults};
