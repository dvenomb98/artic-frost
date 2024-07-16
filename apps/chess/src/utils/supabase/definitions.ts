import { ChessUser, GameState } from "@/chess/lib/definitions"

interface RawGameData {
    fen: string
    gameState: GameState
    users: ChessUser[]
    id: string
  }

export {type RawGameData}