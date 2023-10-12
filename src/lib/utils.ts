// Helpers For UI Components

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { editorFormSchema } from '@/lib/app.schema'
import { Editor } from '@tiptap/react'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
}

export const generateEditorFormDate = (
  posts: z.infer<typeof editorFormSchema>,
  editorContent: string,
) => {
  const formData = new FormData()
  for (let key in posts) {
    const value = (posts as any)[key]

    if (key === 'tags' && value.trim()) {
      const tags = (value as string).split(',').map(tag => tag.trim())
      formData.append('tags', JSON.stringify(tags))
    } else if (key === 'content') {
      formData.append('content', editorContent)
    } else formData.append(key, value)
  }
  return formData
}

export const trimText = (text: string, trimBy: number) => {
  if (text.length <= trimBy) return text
  return text.substring(0, trimBy).trim() + '...'
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
