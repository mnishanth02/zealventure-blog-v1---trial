import { FC, useEffect, useState } from 'react'

import { LinkOptions } from './InsertLink'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface InsertLinkFormProps {
  initialState?: LinkOptions
  onSubmit(link: LinkOptions): void
}

const initialLinkState = {
  url: '',
  newTab: false,
}

const InsertLinkForm: FC<InsertLinkFormProps> = ({
  initialState,
  onSubmit,
}) => {
  const [link, setlink] = useState<LinkOptions>(initialLinkState)

  const handleSubmit = () => {
    onSubmit(link)
    setlink(initialLinkState)
  }

  useEffect(() => {
    if (initialState) setlink({ ...initialState })
  }, [initialState])
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center w-full max-w-sm space-x-2">
        <Input
          type="url"
          value={link.url}
          autoFocus
          placeholder="https://example.com"
          onChange={({ target }) => setlink({ ...link, url: target.value })}
        />

        <Button onClick={handleSubmit} type="submit">
          Apply
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={link.newTab}
          onCheckedChange={e => setlink({ ...link, newTab: !!e })}
          id="newTab"
        />
        <Label htmlFor="newTab">Open in a New Tab</Label>
      </div>
    </div>
  )
}

export default InsertLinkForm
