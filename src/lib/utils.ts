import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

const passwordRegexes = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()]/,
}

export const authFormSchema = () =>
  z.object({
    // sign up
    name: z.string().optional(),
    role: z.nativeEnum(UserRole).optional(),
    //both
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(64, 'Password must be less than 64 characters')
      .refine((pwd) => passwordRegexes.uppercase.test(pwd), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((pwd) => passwordRegexes.lowercase.test(pwd), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((pwd) => passwordRegexes.number.test(pwd), {
        message: 'Password must contain at least one number',
      })
      .refine((pwd) => passwordRegexes.special.test(pwd), {
        message: 'Password must contain at least one special character',
      }),
  })

export const EventSchema = () =>
  z.object({
    _id: z.string().optional(),
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
    date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid date')
      .refine(
        (val) => new Date(val) >= new Date(new Date().toDateString()),
        'Date cannot be in the past'
      ),
    location: z.string().min(3, 'Location must be at least 3 characters'),
  })

// Updated debounce utility
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeout: NodeJS.Timeout

  const debounced = ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as ((...args: Parameters<T>) => void) & { cancel: () => void }

  debounced.cancel = () => {
    clearTimeout(timeout)
  }

  return debounced
}