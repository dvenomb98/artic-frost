import React, { ReactNode } from 'react'

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div className='page--layout lg:grid lg:place-content-center'>{children}</div>
  )
}
