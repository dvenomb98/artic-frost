import { Chat, ChessUser, GameState } from "@/chess/lib/definitions"
 

/** 
* Format is following:
* `{piece}{colindex}{rowindex}`...repeat
*/
type RawMoveHistory = string

interface RawGameData {
    fen: string
    gameState: GameState
    users: ChessUser[]
    id: string
    movesHistory: RawMoveHistory
    chat: Chat[]
    winnerId: string | null
  }

export {type RawGameData}