'use client'

import * as z from 'zod'

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const seoFormSchema = z.object({
  slug: z.string(),
  tags: z.string(),
  meta: z.string().max(150),
})

export const editorFormSchema = z
  .object({
    title: z.string(),
    content: z.string(),
    thumbnail: z.string().or(z.any()),
    slug: z.string(),
    tags: z.string(),
    meta: z.string().max(150),
  })
  .partial()
