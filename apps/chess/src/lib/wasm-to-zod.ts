/*
 *
 * This file is used to convert a `wasm-chess` type to a Zod schemas.
 * Currently need manual conversion.
 *
 *
 * // Types can be found here
 * import type * as wasmChess from "wasm-chess";
 *
 *
 */

import {z} from "zod/v4";

const PIECE_TYPE = z.enum([
  "BlackPawn",
  "BlackKnight",
  "BlackBishop",
  "BlackRook",
  "BlackQueen",
  "BlackKing",
  "WhitePawn",
  "WhiteKnight",
  "WhiteBishop",
  "WhiteRook",
  "WhiteQueen",
  "WhiteKing",
]);

const BOARD = z.array(z.array(PIECE_TYPE));

const SQUARE = z.object({
  row: z.number().min(0).max(7),
  col: z.number().min(0).max(7),
});

const MOVE = z.object({
  from_col_idx: z.number().min(0).max(7),
  from_row_idx: z.number().min(0).max(7),
  to_col_idx: z.number().min(0).max(7),
  to_row_idx: z.number().min(0).max(7),
  is_passant: z.boolean(),
  is_castle: z.boolean(),
  piece: PIECE_TYPE,
});

const GAME_RESULT = z.enum([
  "WhiteCheckmate",
  "BlackCheckmate",
  "Stalemate",
  "InsufficientMaterial",
  "FiftyMoveRule",
  "ThreefoldRepetition",
]);

const PLAYER = z.enum(["White", "Black"]);

const PARSED_FEN_STATE = z.object({
  en_passant_square: SQUARE.nullable(),
  on_turn: PLAYER,
  castle_white_short: z.boolean(),
  castle_white_long: z.boolean(),
  castle_black_short: z.boolean(),
  castle_black_long: z.boolean(),
  half_moves: z.number(),
  full_moves: z.number(),
});

export {PIECE_TYPE, BOARD, SQUARE, MOVE, GAME_RESULT, PLAYER, PARSED_FEN_STATE};
