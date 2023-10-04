import { Editor } from '@tiptap/react'

export const getFocusedEditor = (editor: Editor) => editor.chain().focus()
