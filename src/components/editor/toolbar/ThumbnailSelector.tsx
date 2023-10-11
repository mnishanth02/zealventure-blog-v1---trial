import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { editorFormSchema } from '@/lib/app.schema'
import Image from 'next/image'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

interface ThumbnailSelectorProps {}

const commonClass =
  'flex items-center border border-dashed rounded-lg cursor-pointer aspect-video'

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
                <label htmlFor="thumbnail">
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
                </label>
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
