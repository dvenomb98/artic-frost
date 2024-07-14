import { ChessUser } from "../context/chess-state-manager";

export function getCurrentUser (user: any, users: ChessUser[]): ChessUser {
    return users.find(u => u.id === user)!
}