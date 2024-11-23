import { DetailedHTMLProps, InputHTMLAttributes } from 'react'
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
      
        id={id}
        name={id}
        {...props}
        className="from-input bg-transparent rounded-md"
      />
    </div>
  )
}

export default InputBox
