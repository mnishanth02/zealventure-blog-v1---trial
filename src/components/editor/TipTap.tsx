'use client'

import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

import { Separator } from '@/components/ui/separator'

import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import { useEffect, useState } from 'react'
import EditLink from './toolbar/EditLink'

const Tiptap = () => {
  const [selectionRange, setselectionRange] = useState<Range>()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto',
        },
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: '',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'mx-auto rounded-full',
        },
      }),

      Placeholder.configure({
        placeholder: 'Type Something...',
      }),
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link,
        )
        if (selectionRange) setselectionRange(selectionRange)
      },
      attributes: {
        class: 'prose prose-lg focus:outline-none max-w-full mx-auto h-full',
      },
    },
  })

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange)
    }
  }, [editor, selectionRange])

  return (
    <section className="p-3 space-y-3">
      <Toolbar editor={editor} />
      <Separator />
      {editor ? <EditLink editor={editor} /> : null}
      <EditorContent editor={editor} />
    </section>
  )
}

export default Tiptap
