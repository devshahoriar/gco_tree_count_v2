/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: string | null | undefined | Date) => {
  if (!date) return 'N/A'
  try {
    return format(new Date(date), 'dd MMM yyyy')
  } catch {
    return 'N/A'
  }
}

export const formatCurrency = (amount: string | null | undefined) => {
  if (!amount) return 'N/A'
  return `৳${amount}`
}

export const formatWeight = (weight: string | null | undefined) => {
  if (!weight) return 'N/A'
  return `${weight} kg`
}

export const formatBirthOrder = (order: string | null | undefined) => {
  if (!order) return 'N/A'
  return `${order}th child`
}

export const calculateSectionPercentage = (data: any, fields: string[]) => {
  const filledFields = fields.filter(
    (field) =>
      data[field] !== null && data[field] !== undefined && data[field] !== ''
  ).length
  return Math.round((filledFields / fields.length) * 100)
}