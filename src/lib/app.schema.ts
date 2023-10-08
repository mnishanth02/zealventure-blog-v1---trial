'use client'

import * as z from 'zod'

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
