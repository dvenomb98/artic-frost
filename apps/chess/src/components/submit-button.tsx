'use client'
 import {ReactNode} from "react"
import { useFormStatus} from 'react-dom'
import { Button, ButtonProps}  from "@ui/components"

interface SubmitButtonProps extends ButtonProps {
  children: ReactNode
}
 
 
export function SubmitButton({children, ...props}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" loading={pending} {...props} >
      {children}
    </Button>
  )
}