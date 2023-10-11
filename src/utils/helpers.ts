import { editorFormSchema } from '@/lib/app.schema'
import { z } from 'zod'

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
