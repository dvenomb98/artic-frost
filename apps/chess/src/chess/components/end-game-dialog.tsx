"use client"

import React, { useMemo, useState } from 'react'
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@ui/components/ui/dialog"
import { useChessManager } from '../context/chess-state-manager'

export default function EndGameDialog() {
    const {state: {winnerId, gameState, users}} = useChessManager()
    const [open, setOpen] = useState(!!gameState)
    const title = useMemo(() => {
        if(gameState === "CHECKMATE" && !!winnerId) {
            const color = users.find(u => winnerId === u.id)!.role
            return `${color} won!`
        }

        if(gameState === "DRAW") return "Game ended as draw!"
        return ""

    }, [winnerId, gameState])

  return (
    <Dialog open={open} onOpenChange={setOpen} >
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
         Thanks you for playing!
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
  )
}
