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

  const { control, setValue, watch, formState } =
    useFormContext<z.infer<typeof editorFormSchema>>()

  // Convert a file to base64 string
  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = async ({
    target,
  }) => {
    const { files } = target
    if (!files) return null
    const file = files[0]
    // console.log('file base46-->', convertoBase64(file))
    convertoBase64(file)
    // const base64 = await toBase64(file as File)
    // setValue('thumbnail', URL.createObjectURL(file))
    // setValue('thumbnail', base64)
    // setValue('thumbnail', file)
  }

  const convertoBase64 = (file: File) => {
    const reader = new FileReader()

    if (file) {
      reader.readAsDataURL(file)
      reader.onload = () => {
        console.log(reader.result)
        setValue('thumbnail', reader.result)
      }
      reader.onerror = (error) => {
        console.log('error->', error)
      }
    }
  }

  const thumbnailWatch = watch('thumbnail')
  useEffect(() => {
    if (typeof thumbnailWatch === 'string') {
      setThumbnailTemp(thumbnailWatch)
      // console.log('thumbnailWatch as Stin ->', thumbnailWatch)
    } else {
      // setThumbnailTemp(thumbnailWatch)
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
