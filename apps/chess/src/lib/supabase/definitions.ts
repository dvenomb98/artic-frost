import { Chat, ChessUser, GameState, GameType } from "@/chess/lib/definitions"
 
type RawMoveHistory = string

interface RawGameData {
    fen: string
    created_at: string
    gameState: GameState
    users: ChessUser[]
    id: string // THIS IS GAME ID
    movesHistory: RawMoveHistory
    chat: Chat[]
    winnerId: string | null
    type: GameType
    history: string[]
  }

interface UserGamesData {
  game_id: string
  user_id: string
  created_at: string
  id: number

}

export {type RawGameData, type UserGamesData}