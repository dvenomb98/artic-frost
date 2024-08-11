import React from 'react'
import MovesHistory from './moves-history'
import Chat from "./chat"
import ActionButtons from './action-buttons'
import EngineActions from './engine-actions'

export default function ChessSidebar() {
  return (
    <aside className='p-5 border rounded bg-card flex flex-col gap-6 h-fit self-center'>
      <ActionButtons />
      <EngineActions />
      <div className='grid grid-cols-1 gap-6 lg:grid-rows-[250px_250px] sm:grid-rows-[200px_200px] '>
        <MovesHistory />
        <Chat />
        </div>
    </aside>
  )
}
