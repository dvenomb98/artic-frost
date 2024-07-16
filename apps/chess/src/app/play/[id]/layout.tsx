import React, { ReactNode } from 'react'

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div className='page--layout lg:max-w-[720px] sm:max-w-[620px]'>{children}</div>
  )
}
