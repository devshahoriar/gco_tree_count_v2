/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils'
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react'
import { Label } from '../ui/label'

type InputBoxProps = {
  title: string
  id: string
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const InputBox = ({ id, title, ...props }: InputBoxProps) => {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id}>{title}</Label>
      <input
        autoComplete='off'
        
        id={id}
        name={id}
        {...props}
        className="from-input bg-transparent rounded-md"
      />
    </div>
  )
}


export const InputParent = ({children,className}: {children: ReactNode ,className?: string}) => {
  return  <div className={cn('space-y-2 flex flex-col',className)}>{children}</div>
}

export default InputBox
