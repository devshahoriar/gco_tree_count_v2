/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import DatePicker from 'react-date-picker'

import { cn } from '@/lib/utils'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'

const DateInput = ({
  value,
  className,
  onChange,
}: {
  className?: string
  onChange?: (value: any) => void
  value?: Date
}) => {
  return (
    <DatePicker
      className={cn('from-input bg-transparent rounded-md', className)}
      onChange={onChange}
      value={value}
      format="dd/MM/yyyy"
    />
  )
}

export default DateInput
