import { Timestamp } from 'firebase/firestore'
import type { DateFormatOptions } from '../types'

/**
 * Type guard to check if a value is a Firestore Timestamp
 */
export const isFirestoreTimestamp = (date: unknown): date is Timestamp => {
  return typeof date === 'object' && date !== null && 'toDate' in date && typeof (date as Timestamp).toDate === 'function'
}

/**
 * Normalize different date types to a JavaScript Date object
 */
export const normalizeDate = (date: Date | Timestamp | string): Date => {
  if (isFirestoreTimestamp(date)) {
    return date.toDate()
  }
  if (date instanceof Date) {
    return date
  }
  return new Date(date)
}

/**
 * Format a date to a readable string format
 */
export const formatDate = (date: Date | Timestamp | string | null | undefined, options: DateFormatOptions = {}): string => {
  if (!date) return ''

  const defaultOptions: DateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }

  try {
    const dateObj = normalizeDate(date)
    return dateObj.toLocaleDateString('en-US', defaultOptions)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
}

/**
 * Truncate text to a specific length and add ellipsis
 */
export const truncateText = (text: string | null | undefined, maxLength = 100): string => {
  if (!text || text.length <= maxLength) return text || ''
  return `${text.slice(0, maxLength).trim()}...`
}

/**
 * Generate a random ID
 */
export const generateId = (length = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}
