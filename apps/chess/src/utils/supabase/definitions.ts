import { ChessUser, GameState, MoveHistory } from "@/chess/lib/definitions"

interface RawGameData {
    fen: string
    gameState: GameState
    users: ChessUser[]
    id: string
    movesHistory: MoveHistory[]
  }

export {type RawGameData}