import { FC, useEffect } from 'react'
import { EditorContent } from '@tiptap/react'

import useEditorConfig from '@/hooks/useEditor'

import { Button } from '../ui/button'
import ButtonLoading from './ButtonLoading'

interface CommentFormProps {
  title?: string
  onSubmit(content: string): void
  isLoading?: boolean
  onClose?(): void
  initialState?: string
}

const CommentForm: FC<CommentFormProps> = ({
  title,
  onSubmit,
  isLoading = false,
  onClose,
  initialState = '',
}) => {
  const { editor, selectionRange } = useEditorConfig({
    placeholder: 'Add your Comment',
  })

  const handleSubmit = () => {
    if (editor && !isLoading) {
      const content = editor?.getHTML()
      if (content === '<p></p>') return

      onSubmit(content)
    }
  }

  useEffect(() => {
    if (editor) editor.chain().focus().setContent(initialState).run()
  }, [editor, initialState])

  return (
    <div>
      {title ? <h1 className="py-2 text-xl font-semibold">{title}</h1> : null}
      <EditorContent
        className="min-h-[200px] border-2 border-secondary rounded-md px-2"
        editor={editor}
      />
      <div className="flex justify-end py-3">
        <div className="flex space-x-4">
          <ButtonLoading
            onClick={handleSubmit}
            title="Submit"
            variant={'default'}
            type={'submit'}
            loading={isLoading}
          />
          {onClose ? (
            <Button
              variant={'secondary'}
              onClick={onClose}
              className="px-6 py-2 font-semibold "
            >
              Close
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default CommentForm
