import { FC } from 'react'
import { EditorContent } from '@tiptap/react'

import useEditorConfig from '@/hooks/useEditor'

import ButtonLoading from './ButtonLoading'

interface CommentFormProps {
  title?: string
}

const CommentForm: FC<CommentFormProps> = ({ title }) => {
  const { editor, selectionRange } = useEditorConfig({
    placeholder: 'Add your Comment',
  })
  return (
    <div>
      {title ? <h1 className="py-2 text-xl font-semibold">{title}</h1> : null}
      <EditorContent
        className="min-h-[200px] border-2 border-secondary rounded-md px-2"
        editor={editor}
      />
      <div className="flex justify-end py-3">
        <div className="inline-block">
          <ButtonLoading title="Submit" variant={'default'} type={'button'} />
        </div>
      </div>
    </div>
  )
}

export default CommentForm
