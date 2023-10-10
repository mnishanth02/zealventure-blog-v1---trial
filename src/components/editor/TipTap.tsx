'use client'

import { FC, useEffect, useState } from 'react'
import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

import { Separator } from '@/components/ui/separator'

import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import EditLink from './toolbar/EditLink'
import { Input } from '../ui/input'
import SeoForm from './SeoForm'
import ButtonLoading from '../common/ButtonLoading'
import ThumbnailSelector from './toolbar/ThumbnailSelector'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { editorFormSchema } from '@/lib/app.schema'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { log } from 'console'

interface Props {
  slug?: string
  buttonTitle?: string
}
const Tiptap: FC<Props> = ({ slug, buttonTitle = 'submit' }) => {
  const [selectionRange, setselectionRange] = useState<Range>()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto',
        },
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: '',
        },
      }),
      Youtube.configure({
        width: 840,
        height: 472.5,
        HTMLAttributes: {
          class: 'mx-auto rounded-full',
        },
      }),

      Placeholder.configure({
        placeholder: 'Type Something...',
      }),
    ],
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link,
        )
        if (selectionRange) setselectionRange(selectionRange)
      },
      attributes: {
        class:
          'max-w-full mx-auto dark:text-secondary-foreground h-full prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (editor && selectionRange) {
      editor.commands.setTextSelection(selectionRange)
    }
  }, [editor, selectionRange])

  const editorForm = useForm<z.infer<typeof editorFormSchema>>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      title: '',
      content: '',
      meta: '',
      slug: '',
      tags: '',
      thumbnail: '',
    },
  })

  const { reset, handleSubmit, getValues, control } = editorForm

  useEffect(() => {
    axios.get(`/api/posts/${slug}`).then((data: any) => {
      // console.log('axios post data ->>', data.data.post)
      reset(data.data.post)
    })
  }, [reset, slug])

  const createPost = async (formData: FormData) => {
    console.log('UI- Orm data -> ', formData)

    await axios.post('/api/posts', formData)
  }

  const { mutate: createPostMutation, isLoading: isUploading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      console.log('sucess')
      // queryClient.invalidateQueries(['images'])
    },
    onError: () => {
      console.log('Error ')
    },
  })

  function onSubmitHandler(posts: z.infer<typeof editorFormSchema>) {
    if (!editor) return null

    const formData = new FormData()
    for (let key in posts) {
      const value = (posts as any)[key]

      if (key === 'tags' && value.trim()) {
        const tags = (value as string).split(',').map(tag => tag.trim())
        formData.append('tags', JSON.stringify(tags))
      } else if (key === 'content') {
        formData.append('content', editor.getHTML())
      } else formData.append(key, value)
    }

    createPostMutation(formData)
  }

  const initialContent = getValues('content')
  useEffect(() => {
    if (initialContent) {
      editor?.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  return (
    <section className="p-3 space-y-4 text-secondary-foreground ">
      <FormProvider {...editorForm}>
        <Form {...editorForm}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="sticky top-0 z-10 space-y-4">
              <div className="flex items-center justify-between ">
                <ThumbnailSelector />
                <div className="inline-block">
                  <ButtonLoading
                    variant={'default'}
                    type={'submit'}
                    title={buttonTitle}
                    loading={false}
                  />
                </div>
              </div>
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Title"
                        className="mb-3 text-3xl italic font-semibold focus-visible:ring-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Toolbar editor={editor} />
              <Separator />
            </div>

            {editor ? <EditLink editor={editor} /> : null}
            <EditorContent
              editor={editor}
              className="min-h-[300px] dark:text-secondary"
            />
            <Separator />
            <SeoForm />
          </form>
        </Form>
      </FormProvider>
    </section>
  )
}

export default Tiptap
