import { ChessUser } from "@/chess/lib/definitions";

export function getCurrentUser (user: any, users: ChessUser[]): ChessUser {
    return users.find(u => u.id === user)!
}