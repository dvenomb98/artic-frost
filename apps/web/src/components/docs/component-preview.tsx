import { cn } from '@repo/ui/lib/utils/cn'
import React, { FC, PropsWithChildren } from 'react'

export interface ComponentPreviewProps extends PropsWithChildren {
    className: string
}

export default function ComponentPreview ({children, className}: ComponentPreviewProps){
  return (
    <div className={cn("grid place-content-center w-full min-h-[500px] sm:min-h-[300px] bg-muted/50 rounded-md", className)}>
        {children}
    </div>
  )
}

