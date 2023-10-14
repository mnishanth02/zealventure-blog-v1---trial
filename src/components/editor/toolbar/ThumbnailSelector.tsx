import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import Image from 'next/image'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { editorFormSchema } from '@/lib/app.schema'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ThumbnailSelectorProps {}

const commonClass =
  'flex items-center border border-dashed rounded-lg cursor-pointer aspect-video border border-secondary-foreground/40'

const ThumbnailSelector: FC<ThumbnailSelectorProps> = () => {
  const [thumbnailTemp, setThumbnailTemp] = useState('')

  const { control, setValue, watch } =
    useFormContext<z.infer<typeof editorFormSchema>>()

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files } = target
    if (!files) return null
    const file = files[0]
    setValue('thumbnail', file)
  }

  const thumbnailWatch = watch('thumbnail')
  useEffect(() => {
    if (typeof thumbnailWatch === 'string') {
      setThumbnailTemp(thumbnailWatch)
    } else {
      setThumbnailTemp(URL.createObjectURL(thumbnailWatch))
    }
  }, [thumbnailWatch])

  return (
    <div className="w-32 ">
      <FormField
        control={control}
        name="thumbnail"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div>
                <Input
                  type="file"
                  id="thumbnail"
                  className="hidden"
                  accept="image/jpg, image/png, image/jpeg"
                  onChange={handleInputChange}
                />
                <Label htmlFor="thumbnail">
                  {thumbnailTemp ? (
                    <Image
                      src={thumbnailTemp}
                      alt="Thumbnail Image"
                      className={commonClass}
                      style={{ objectFit: 'cover' }}
                      width={150}
                      height={100}
                    />
                  ) : (
                    <PosterUI label="Thumbnail" />
                  )}
                </Label>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
interface PosterUIProps {
  label: string
  className?: string
}

const PosterUI: FC<PosterUIProps> = ({ label, className }) => {
  return (
    <div className={commonClass}>
      <span className="mx-auto">{label}</span>
    </div>
  )
}

export default ThumbnailSelector
