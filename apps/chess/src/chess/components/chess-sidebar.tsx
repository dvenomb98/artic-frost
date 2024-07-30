import React from 'react'
import MovesHistory from './moves-history'
import Chat from "./chat"
import ActionButtons from './action-buttons'

export default function ChessSidebar() {
  return (
    <aside className='p-5 border rounded bg-card flex flex-col gap-4'>
      <ActionButtons />
      <div className='grid grid-cols-1 gap-4 grid-rows-2 max-h-[900px] sm:max-h-[600px] flex-1'>
        <MovesHistory />
        <Chat />
        </div>
    </aside>
  )
}
