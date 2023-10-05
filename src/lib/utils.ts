import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Editor } from '@tiptap/react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFocusedEditor = (editor: Editor) => editor.chain().focus()

export const validateUrl = (url: string) => {
  if (!url.trim()) return ''
  let finalUrl: URL
  try {
    finalUrl = new URL(url)
  } catch (error) {
    finalUrl = new URL('http://' + url)
  }

  return finalUrl.origin
}
