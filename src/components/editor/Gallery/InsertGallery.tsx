import { ChangeEventHandler, FC, useState } from 'react'
import Image from 'next/image'
import { DialogClose } from '@radix-ui/react-dialog'
import { Editor } from '@tiptap/react'
import { BsImageFill } from 'react-icons/bs'

import { cn, getFocusedEditor } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import ButtonLoading from '@/components/common/ButtonLoading'

import Gallery from './Gallery'

export type ImageSelectionResult = {
  src: string
  altText: string
}
interface InsertGalleryProps {
  images: { src: string }[]
  editor: Editor
  uploading?: boolean
  onFileSelect(image: File): void
  onSelect(relult: ImageSelectionResult): void
}

const InsertGallery: FC<InsertGalleryProps> = ({
  images,
  editor,
  uploading,
  onFileSelect,
  onSelect,
}) => {
  const [selectedImage, setSelectedImage] = useState('')
  const [altText, setAltText] = useState('')

  const handleOnImageChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { files } = target
    if (!files) return

    const file = files[0]

    if (!file.type.startsWith('image')) return

    onFileSelect(file)
  }

  const handleSelection = () => {
    if (!selectedImage) return
    onSelect({ src: selectedImage, altText })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Toggle
          active={editor.isActive('image')}
          variant={'outline'}
          size={'sm'}
          onClick={() => getFocusedEditor(editor).toggleBold().run()}
          aria-label="Toggle Image"
        >
          <BsImageFill size={20} />
        </Toggle>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image Upload</DialogTitle>
          <DialogDescription asChild>
            <div className="flex max-w-4xl space-x-2 max-h-[450px]">
              <ScrollArea className="basis-[75%] p-2 rounded-md border ">
                <Gallery
                  uploading={uploading}
                  images={images}
                  selectedImage={selectedImage}
                  onSelect={(src) => setSelectedImage(src)}
                />
              </ScrollArea>

              <div className=" basis-1/4">
                <div className="space-y-2">
                  <div className="grid w-full max-w-sm items-center gap-1.5 text-foreground">
                    <Input
                      onChange={handleOnImageChange}
                      id="picture"
                      type="file"
                      className="hidden"
                    />
                    <label
                      className={cn(buttonVariants(), 'cursor-pointer')}
                      htmlFor="picture"
                    >
                      Upload Image
                    </label>
                  </div>

                  {selectedImage ? (
                    <>
                      <Textarea
                        placeholder="Alt Text"
                        className="w-full h-32 resize-none"
                        value={altText}
                        onChange={({ target }) => setAltText(target.value)}
                      ></Textarea>
                      <DialogClose asChild>
                        <ButtonLoading
                          type={'button'}
                          variant={'secondary'}
                          title="Select"
                          onClick={handleSelection}
                        />
                      </DialogClose>

                      <div className="relative aspect-video bg-png-pattern">
                        <Image
                          src={selectedImage}
                          alt="selectedImage"
                          fill
                          sizes="auto"
                          style={{ objectFit: 'contain' }}
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default InsertGallery
