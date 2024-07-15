'use client'
 
import { useFormStatus, ReactNode} from 'react-dom'
import {Button} from "@ui/components/ui/button"
 
export function SubmitButton({children}: {children: ReactNode}) {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" loading={pending} >
      {children}
    </Button>
  )
}