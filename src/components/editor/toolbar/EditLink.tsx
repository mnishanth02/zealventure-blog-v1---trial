import { BubbleMenu, Editor } from '@tiptap/react'
import { FC, useCallback } from 'react'
import { Button } from '../../ui/button'
import { BsBoxArrowRight, BsPencilSquare } from 'react-icons/bs'
import { BiUnlink } from 'react-icons/bi'
import { LinkOptions } from './InsertLink'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import InsertLinkForm from './InsertLinkForm'

interface EditLinkProps {
  editor: Editor
}

const EditLink: FC<EditLinkProps> = ({ editor }) => {
  const handleLinkOpenClick = useCallback(() => {
    // getFocusedEditor(editor).toggleCodeBlock().run()
    const { href } = editor.getAttributes('link')
    if (href) {
      window.open(href, '_blank')
    }
  }, [editor])

  const handleUnlinkClick = () => {
    editor.commands.unsetLink()
  }
  const handleSubmit = ({ url, newTab }: LinkOptions) => {
    if (url.trim())
      editor
        .chain()
        .focus()
        .unsetLink()
        .setLink({ href: url, target: newTab ? '_blank' : '' })
        .run()
  }

  const getInitialState = useCallback(() => {
    const { href, target } = editor.getAttributes('link')
    return { url: href, newTab: target ? true : false }
  }, [editor])

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive('link')}
    >
      <div className="z-40 flex items-center p-3 space-x-6">
        <Button variant="outline" size="icon" onClick={handleLinkOpenClick}>
          <BsBoxArrowRight className="w-4 h-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <BsPencilSquare className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <InsertLinkForm
              onSubmit={handleSubmit}
              initialState={getInitialState()}
            />
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="icon" onClick={handleUnlinkClick}>
          <BiUnlink className="w-4 h-4" />
        </Button>
      </div>
    </BubbleMenu>
  )
}

export default EditLink
