import { Editor } from '@tiptap/react'
import { FC, useEffect } from 'react'

import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Toggle } from '../ui/toggle'
import {
  BsTypeBold,
  BsTypeStrikethrough,
  BsBraces,
  BsCode,
  BsListOl,
  BsListUl,
  BsTypeItalic,
  BsTypeUnderline,
  BsImageFill,
  BsYoutube,
} from 'react-icons/bs'

import { RiDoubleQuotesL } from 'react-icons/ri'
import { getFocusedEditor } from '@/lib/utils'
import InsertLink, { LinkOptions } from './toolbar/InsertLink'
import EmbedYoutube from './toolbar/EmbedYoutube'
import axios from 'axios'
import InsertGallery, { ImageSelectionResult } from './Gallery/InsertGallery'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
interface ToolbarProps {
  editor: Editor | null
}

const Toolbar: FC<ToolbarProps> = ({ editor }) => {
  const queryClient = useQueryClient()

  const fetchImages = async () => {
    const { data } = await axios('/api/image')
    return data.images as { src: string }[]
  }

  const {
    data = [],
    isLoading: imageIsLoading,
    isError,
  } = useQuery({
    queryKey: ['images'],
    queryFn: fetchImages,
  })

  // Mutation logics
  const uploadImage = async (formData: FormData) => {
    await axios.post('/api/image', formData)
  }

  const { mutate: uploadMutaton, isLoading: isUploading } = useMutation({
    mutationFn: uploadImage,
    onSuccess: () => {
      console.log('sucess')
      queryClient.invalidateQueries(['images'])
    },
    onError: () => {
      console.log('Error ')
    },
  })

  const handleImageUpload = async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    uploadMutaton(formData)
  }

  if (!editor) return null

  const getDDLabel = (): string => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    return 'Paragraph'
  }
  const toggleDDStyle = (value: string) => {
    switch (value) {
      case 'paragraph':
        getFocusedEditor(editor).setParagraph().run()
        break
      case 'heading1':
        getFocusedEditor(editor).toggleHeading({ level: 1 }).run()
        break
      case 'heading2':
        getFocusedEditor(editor).toggleHeading({ level: 2 }).run()
        break
      case 'heading3':
        getFocusedEditor(editor).toggleHeading({ level: 3 }).run()
        break
      default:
        getFocusedEditor(editor).setParagraph().run()
        break
    }
  }

  const handleLinkFormSubmit = ({ url, newTab }: LinkOptions) => {
    if (newTab) {
      editor.commands.setLink({ href: url, target: '_blank' })
    } else {
      editor.commands.setLink({ href: url })
    }
  }

  const handleEmbedYoutube = (url: string) => {
    editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
      .focus()
      .setImage({ src: result.src, alt: result.altText })
      .run()
  }

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={toggleDDStyle}>
        <SelectTrigger className="w-[180px]">{getDDLabel()}</SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="paragraph">Paragraph</SelectItem>
            <SelectItem value="heading1">Heading 1</SelectItem>
            <SelectItem value="heading2">Heading 2</SelectItem>
            <SelectItem value="heading3">Heading 3</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" />
      <Toggle
        active={editor.isActive('bold')}
        size="sm"
        variant={'outline'}
        onClick={() => getFocusedEditor(editor).toggleBold().run()}
        aria-label="Toggle Bold"
      >
        <BsTypeBold size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('italic')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleItalic().run()}
        aria-label="Toggle Italic"
      >
        <BsTypeItalic size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('underline')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
        aria-label="Toggle Underline"
      >
        <BsTypeUnderline size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('strike')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleStrike().run()}
        aria-label="Toggle Strike"
      >
        <BsTypeStrikethrough size={20} />
      </Toggle>

      <Toggle
        active={editor.isActive('blockquote')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
        aria-label="Toggle BlockQuote"
      >
        <RiDoubleQuotesL size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('code')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleCode().run()}
        aria-label="Toggle Code"
      >
        <BsCode size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('codeBlock')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
        aria-label="Toggle CodeBlock"
      >
        <BsBraces size={20} />
      </Toggle>

      <InsertLink editor={editor} onSubmit={handleLinkFormSubmit} />

      <Toggle
        active={editor.isActive('orderedList')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
        aria-label="Toggle ListOL"
      >
        <BsListOl size={20} />
      </Toggle>
      <Toggle
        active={editor.isActive('bulletList')}
        variant={'outline'}
        size={'sm'}
        onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
        aria-label="Toggle ListUL"
      >
        <BsListUl size={20} />
      </Toggle>

      <EmbedYoutube onSubmit={handleEmbedYoutube} editor={editor} />

      <InsertGallery
        editor={editor}
        uploading={isUploading}
        onFileSelect={handleImageUpload}
        onSelect={handleImageSelection}
        images={data}
      />
    </div>
  )
}

export default Toolbar
