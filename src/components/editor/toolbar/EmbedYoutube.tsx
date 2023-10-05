import { FC, useState } from 'react'
import { BsYoutube } from 'react-icons/bs'
import { Editor } from '@tiptap/react'
import { Toggle } from '@/components/ui/toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface YoutubeFormProps {
  editor: Editor
  onSubmit(url: string): void
}
const EmbedYoutube: FC<YoutubeFormProps> = ({ editor, onSubmit }) => {
  const [url, setUrl] = useState('')
  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit(url)
      setUrl('')
    }
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
          <BsYoutube size={20} />
        </Toggle>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center w-full max-w-sm space-x-2">
          <Input
            type="url"
            value={url}
            autoFocus
            placeholder="https://youtube.com"
            onChange={({ target }) => setUrl(target.value)}
          />

          <Button onClick={handleSubmit} type="submit">
            Embed
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default EmbedYoutube
