'use client'

import { useEditor, EditorContent, getMarkRange, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Toolbar from './Toolbar'

import { Separator } from '@/components/ui/separator'

import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import { useEffect, useState } from 'react'
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

const Tiptap = () => {
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

  const initialVal: z.infer<typeof editorFormSchema> = {
    content: 'New COntent',
    meta: 'Meta Test',
    slug: 'Slug',
    tags: 'Tags',
    thumbnail:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
    title: 'New Title',
  }

  const editorForm = useForm<z.infer<typeof editorFormSchema>>({
    resolver: zodResolver(editorFormSchema),
    defaultValues: {
      title: initialVal.title,
      content: initialVal.content,
      thumbnail: initialVal.thumbnail,
      slug: initialVal.slug,
      tags: initialVal.tags,
      meta: initialVal.meta,
    },
  })

  function onSubmitHandler(values: z.infer<typeof editorFormSchema>) {
    if (!editor) return null

    console.log('content', editor.getHTML())
    // editorForm.setValue('content', editor.getHTML())
    console.log('File Content', { ...values })
  }

  const initialContent = editorForm.getValues('content')
  useEffect(() => {
    if (initialContent) {
      editor?.commands.setContent(initialContent)
    }
  }, [initialContent, editor])

  return (
    <section className="p-3 space-y-4 text-secondary-foreground ">
      <FormProvider {...editorForm}>
        <Form {...editorForm}>
          <form onSubmit={editorForm.handleSubmit(onSubmitHandler)}>
            <div className="sticky top-0 z-10 space-y-4">
              <div className="flex items-center justify-between ">
                <ThumbnailSelector />
                <div className="inline-block">
                  <ButtonLoading
                    variant={'default'}
                    type={'submit'}
                    title="Submit"
                    loading={false}
                  />
                </div>
              </div>
              <FormField
                control={editorForm.control}
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
