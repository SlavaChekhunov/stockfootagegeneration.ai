import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (process.env.NODE_ENV === 'production') {
    return `https://clipcraftai.com${path}`
  }
  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}



export function constructMetadata({
  title = "Quill - the SaaS for students and professionals alike.",
  description = "Quill is an open-source software to make chatting to your PDF files easy.",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@TechWithSlava"
    },
    icons,
    metadataBase: new URL('https://www.clipcraftai.com'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}



