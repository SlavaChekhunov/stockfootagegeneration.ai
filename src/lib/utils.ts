import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (process.env.NODE_ENV === 'production') {
    return `https://clipcraftai.com${path}`
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}



