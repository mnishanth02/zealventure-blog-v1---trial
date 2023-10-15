import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Post'
import { z } from 'zod'

import { editorFormSchema } from '@/lib/app.schema'
import cloudinary from '@/lib/cloudinary'
import dbConnect from '@/lib/dbConnect'
import { isAdmin } from '@/lib/helpers'
import { isBase64Image } from '@/lib/utils'
import { PostValidationSchema, validateSchema } from '@/lib/validator'

// Get Post By Id
export const GET = async (
  request: Request,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params

  try {
    await dbConnect()
    const post = await Post.findOne({ slug })
    if (!post) NextResponse.json({ error: 'Post Not found' }, { status: 400 })

    const postRes: z.infer<typeof editorFormSchema> = {
      id: post?._id.toString(),
      title: post?.title,
      content: post?.content,
      tags: post?.tags.join(','),
      slug: post?.slug,
      meta: post?.meta,
      thumbnail: post?.thumbnail?.url || '',
    }
    return NextResponse.json({ post: postRes }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Update post by postId
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { slug: string } },
) => {
  try {
    const admin = await isAdmin()
    if (!admin)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    const { slug: postId } = params

    await dbConnect()
    let existingPost = await Post.findById(postId)
    if (!existingPost)
      NextResponse.json({ error: 'Post Not found' }, { status: 404 })

    const formData = await req.formData()
    let body = Object.fromEntries(formData)
    console.log(body)

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)

    const error = validateSchema(PostValidationSchema, { ...body, tags })
    if (error) return NextResponse.json({ error }, { status: 400 })

    const { title, content, slug, meta, thumbnail } = body

    if (existingPost) {
      existingPost.title = title.toString()
      existingPost.content = content.toString()
      existingPost.slug = slug.toString()
      existingPost.meta = meta.toString()

      if (thumbnail && isBase64Image(thumbnail.toString())) {
        try {
          const { secure_url, url } = await cloudinary.uploader.upload(
            thumbnail.toString(),
            {
              folder: 'zealventure/blog',
              upload_preset: 'yeqhjlwt',
              use_filename: true,
            },
          )

          const existingPublicId = existingPost.thumbnail?.public_id
          if (existingPublicId)
            await cloudinary.uploader.destroy(existingPublicId)

          existingPost.thumbnail = {
            url: secure_url,
            public_id: url,
          }
        } catch (error) {
          console.log(error)
          return NextResponse.json({ error: error }, { status: 400 })
        }
      }
    }

    if (existingPost) await existingPost.save()

    return NextResponse.json({ post: existingPost }, { status: 200 })
  } catch (error: any) {
    console.log(error.response.data)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

// Delete Post By Id
export const DELETE = async (
  request: Request,
  { params }: { params: { slug: string } },
) => {
  const { slug: postId } = params

  try {
    const admin = await isAdmin()
    if (!admin)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    await dbConnect()
    const post = await Post.findByIdAndDelete(postId)

    if (!post) NextResponse.json({ error: 'Post Not found' }, { status: 404 })

    const publicId = post?.thumbnail?.public_id

    if (publicId) await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({ removed: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}