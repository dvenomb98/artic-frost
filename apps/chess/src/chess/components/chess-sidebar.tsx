import React from 'react'
import MovesHistory from './moves-history'
import Chat from "./chat"

export default function ChessSidebar() {
  return (
    <aside className='p-5 border rounded bg-card grid grid-cols-1 grid-rows-2'>
        <MovesHistory />
        <Chat />
    </aside>
  )
}
