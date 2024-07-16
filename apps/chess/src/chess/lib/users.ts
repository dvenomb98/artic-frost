import { ChessUser } from "@/chess/lib/definitions";

export function getCurrentUser (userId: string, users: ChessUser[]): ChessUser | undefined {
    return users.find(u => u.id === userId)
}