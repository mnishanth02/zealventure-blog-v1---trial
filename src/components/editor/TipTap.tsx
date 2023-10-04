'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

import { Separator } from '@/components/ui/separator'

import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: 'Type Something...',
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-full mx-auto h-full',
      },
    },
  })

  return (
    <section className="p-3 space-y-3">
      <Toolbar editor={editor} />
      <Separator />
      <EditorContent editor={editor} />
    </section>
  )
}

export default Tiptap
