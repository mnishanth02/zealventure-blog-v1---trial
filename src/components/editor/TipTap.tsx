'use client'

import { FC, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, getMarkRange, Range, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import axios from 'axios'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import { editorFormSchema } from '@/lib/app.schema'
import { generateEditorFormDate } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

import ButtonLoading from '../common/ButtonLoading'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import SeoForm from './SeoForm'
import Toolbar from './Toolbar'
import EditLink from './toolbar/EditLink'
import ThumbnailSelector from './toolbar/ThumbnailSelector'

interface Props {
  slug?: string
  postId?: string
  buttonTitle?: string
}
const Tiptap: FC<Props> = ({ slug, buttonTitle = 'Submit' }) => {
  const [selectionRange, setselectionRange] = useState<Range>()
  const queryClient = useQueryClient()

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
          'max-w-full mx-auto dark:prose-invert h-full prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
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
    if (slug) {
      axios.get(`/api/posts/${slug}`).then((data: any) => {
        // console.log('axios post data ->>', data.data.post)
        reset(data.data.post)
      })
    }
  }, [reset, slug])

  const createPost = async (formData: FormData) => {
    await axios.post('/api/posts', formData)
  }
  const patchPost = async (formData: FormData) => {
    const postId = formData.get('id')
    console.log('Post ID -UI -->', postId)

    await axios.patch(`/api/posts/${postId}`, formData)
  }

  const { mutate: createPostMutation, isLoading: isUploading } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
    },
    onError: () => {
      console.log('Error ')
    },
  })
  const { mutate: patchPostMutation, isLoading: isUpdating } = useMutation({
    mutationFn: patchPost,
    onSuccess: () => {
      console.log('sucess')
      queryClient.invalidateQueries(['posts'])
    },
    onError: () => {
      console.log('Error ')
    },
  })

  function onSubmitHandler(posts: z.infer<typeof editorFormSchema>) {
    if (!editor) return null

    const formData = generateEditorFormDate(posts, editor.getHTML())

    if (buttonTitle === 'Update') {
      patchPostMutation(formData)
    } else {
      createPostMutation(formData)
    }
  }

  const initialContent = getValues('content')
  useEffect(() => {
    if (initialContent) {
      editor?.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  return (
    <section className="p-3 space-y-4 text-secondary-foreground">
      <FormProvider {...editorForm}>
        <Form {...editorForm}>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="sticky top-0 z-20 space-y-4 bg-background">
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
                        className="mb-3 text-3xl italic font-semibold h-14 focus-visible:ring-0"
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
