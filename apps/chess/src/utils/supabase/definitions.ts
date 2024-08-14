import { Chat, ChessUser, GameState, GameType } from "@/chess/lib/definitions"
 

/** 
* Format is following:
* `{piece}{colindex}{rowindex}`...repeat
*/
type RawMoveHistory = string

interface RawGameData {
    fen: string
    created_at: string
    gameState: GameState
    users: ChessUser[]
    id: string
    movesHistory: RawMoveHistory
    chat: Chat[]
    winnerId: string | null
    type: GameType
    history: string[]
  }

export {type RawGameData}