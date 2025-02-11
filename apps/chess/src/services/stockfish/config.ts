import { EngineDifficultyKeys } from "../models";

interface EngineConfigValues {
  MAX_DEPTH: number;
  NUMBER_OF_LINES: number;
  SKILL_LEVEL: number;      // Stockfish skill level (0-20)
  CONTEMPT: number;         // Engine's contempt factor (-100 to 100)
  HASH_SIZE: number;        // Memory used for hash tables (MB)
  THREADS: number;          // Number of CPU threads to use
  MOVE_OVERHEAD: number;    // Time buffer for move execution (ms)
}

const ENGINE_VERSION = "v0.2";

const ENGINE_CONFIG: Record<EngineDifficultyKeys, EngineConfigValues> = {
  EASY: {
    MAX_DEPTH: 1,          // Extremely shallow search
    NUMBER_OF_LINES: 1,
    SKILL_LEVEL: 0,        // Lowest possible skill level (max randomness)
    CONTEMPT: 50,          // Aggressive play (encourages blunders)
    HASH_SIZE: 16,
    THREADS: 1,
    MOVE_OVERHEAD: 10,     // 100ms thinking time (10 * 10ms)
  },
  HARD: {
    MAX_DEPTH: 15,
    NUMBER_OF_LINES: 3,
    SKILL_LEVEL: 15,
    CONTEMPT: 15,
    HASH_SIZE: 128,
    THREADS: 4,
    MOVE_OVERHEAD: 20,
  },
  ANALYZE: {
    MAX_DEPTH: 20,
    NUMBER_OF_LINES: 5,
    SKILL_LEVEL: 20,
    CONTEMPT: 0,      // Neutral contempt for analysis
    HASH_SIZE: 256,
    THREADS: 8,
    MOVE_OVERHEAD: 10,
  },
};

export { ENGINE_CONFIG, ENGINE_VERSION, type EngineConfigValues };
