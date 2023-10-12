import { FC } from 'react'
import { BsLink45Deg } from 'react-icons/bs'
import { Editor } from '@tiptap/react'
import InsertLinkForm from './InsertLinkForm'
import { Toggle } from '@/components/ui/toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { validateUrl } from '@/lib/utils'

interface LinkFormProps {
  editor: Editor
  onSubmit(link: LinkOptions): void
}
export type LinkOptions = {
  url: string
  newTab: boolean
}

const InsertLink: FC<LinkFormProps> = ({ editor, onSubmit }) => {
  const handleSubmit = (link: LinkOptions) => {
    if (link.url.trim()) onSubmit({ ...link, url: validateUrl(link.url) })
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Toggle
          variant={'outline'}
          size={'sm'}
          active={editor.isActive('link')}
          aria-label="Toggle Link"
        >
          <BsLink45Deg size={20} />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent>
        <InsertLinkForm onSubmit={handleSubmit} />
      </PopoverContent>
    </Popover>
  )
}

export default InsertLink
