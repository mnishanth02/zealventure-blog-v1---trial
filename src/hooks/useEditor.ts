import { useState } from 'react'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { getMarkRange, Range, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface options {
  placeholder: string
}

const useEditorConfig = (options?: options) => {
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
        placeholder: options?.placeholder || 'Type Something...',
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
        class:
          'max-w-full mx-auto dark:prose-invert h-full prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  })
  return { editor, selectionRange }
}

export default useEditorConfig
