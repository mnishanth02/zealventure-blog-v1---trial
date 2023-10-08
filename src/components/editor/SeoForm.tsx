'use client'
import { FC, useEffect } from 'react'
import * as z from 'zod'
import { InputWithLabel } from '../ui/inputWithLabel'
import { Textarea } from '../ui/textarea'
import { useFormContext } from 'react-hook-form'
import { editorFormSchema } from '@/lib/app.schema'
import { FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import slugify from 'slugify'

const SeoForm: FC = () => {
  const { control, setValue, watch } =
    useFormContext<z.infer<typeof editorFormSchema>>()

  const titleWatch = watch('title')

  useEffect(() => {
    setValue('slug', titleWatch ? slugify(titleWatch) : '')
  }, [setValue, titleWatch])

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold underline">SEO Section</h1>
      <FormField
        control={control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <InputWithLabel
                label="Slug :"
                placeholder="slug-goes-here"
                className="pl-12 italic focus-visible:ring-0"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <InputWithLabel
                label="Tags :"
                placeholder="React, NextJs"
                className="pl-12 italic focus-visible:ring-0"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="meta"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                charCount={true}
                count={150}
                className="h-20 resize-none focus-visible:ring-0"
                placeholder="Meta description 150 characters"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  )
}

export default SeoForm
