import React, { ReactNode } from 'react'

export default function Note({children}: {children: ReactNode}) {
  return (
    <div className='border rounded text-sm p-2 px-4 w-full'>
       {children}
    </div>
  )
}
