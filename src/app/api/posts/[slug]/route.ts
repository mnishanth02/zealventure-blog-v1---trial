import { NextRequest, NextResponse } from 'next/server'
import Post from '@/models/Post'
import streamifier from 'streamifier'
import { z } from 'zod'

import { CloudinaryResponse } from '@/types/app'
import { editorFormSchema } from '@/lib/app.schema'
import cloudinary from '@/lib/cloudinary'
import dbConnect from '@/lib/dbConnect'
import { PostValidationSchema, validateSchema } from '@/lib/validator'

// Get Post By Id
export const GET = async (
  request: Request,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params
  console.log('slug', slug)
  // if (postId === 'create') return null

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
    const { slug: postId } = params
    console.log('Post ID from Server ->>>> ', postId)

    await dbConnect()
    let existingPost = await Post.findById(postId)
    if (!existingPost)
      NextResponse.json({ error: 'Post Not found' }, { status: 404 })

    const formData = await req.formData()
    let body = Object.fromEntries(formData)
    // console.log(body)

    let tags = []
    if (body.tags) tags = JSON.parse(body.tags as string)

    const error = validateSchema(PostValidationSchema, { ...body, tags })
    if (error) return NextResponse.json({ error }, { status: 400 })

    const { title, content, slug, meta, thumbnail } = body

    console.log('postexist->', existingPost)

    if (existingPost) {
      existingPost.title = title.toString()
      existingPost.content = content.toString()
      existingPost.slug = slug.toString()
      existingPost.meta = meta.toString()

      if (thumbnail && typeof thumbnail !== 'string') {
        const data = thumbnail as Blob
        console.log('thumbnail', data)
        const buffer = Buffer.from(await data.arrayBuffer())
        try {
          const response = new Promise((resolve, reject) => {
            return streamifier.createReadStream(buffer).pipe(
              cloudinary.uploader.upload_stream(
                {
                  folder: 'zealventure/blog',
                  upload_preset: 'yeqhjlwt',
                  use_filename: true,
                },
                (error, result) => {
                  if (error) {
                    console.log('error-<', error)
                    reject(error)
                  }
                  resolve(result)
                  // console.log('Result -<< ', result)
                },
              ),
            )
          })
          const newUploaderResponse = (await response) as CloudinaryResponse
          console.log('newUploaderResponse', newUploaderResponse)

          const existingPublicId = existingPost.thumbnail?.public_id
          if (existingPublicId)
            await cloudinary.uploader.destroy(existingPublicId)

          existingPost.thumbnail = {
            url: newUploaderResponse.secure_url,
            public_id: newUploaderResponse.public_id,
          }
          console.log('Bedore ssave in Server')
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
  }
}

// Delete Post By Id
export const DELETE = async (
  request: Request,
  { params }: { params: { slug: string } },
) => {
  const { slug: postId } = params

  try {
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
