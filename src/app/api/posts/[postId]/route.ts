import { editorFormSchema } from '@/lib/app.schema'
import dbConnect from '@/lib/dbConnect'
import { PostValidationSchema, validateSchema } from '@/lib/validator'
import Post from '@/models/Post'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import streamifier from 'streamifier'
import cloudinary from '@/lib/cloudinary'
import { CloudinaryResponse } from '../../../../../types/app'

// Get Post By Id
export const GET = async (
  request: Request,
  { params }: { params: { postId: string } },
) => {
  const { postId } = params
  console.log('postId', postId)
  // if (postId === 'create') return null

  try {
    await dbConnect()
    const post = await Post.findById(postId)
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
  { params }: { params: { postId: string } },
) => {
  try {
    const { postId } = params
    await dbConnect()
    let existingPost = await Post.findById(postId)
    if (!existingPost)
      NextResponse.json({ error: 'Post Not found' }, { status: 400 })

    const formData = await req.formData()
    let body = Object.fromEntries(formData)
    console.log(body)

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

      if (thumbnail) {
        const data = thumbnail as Blob
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
          const existingPublicId = existingPost.thumbnail?.public_id
          if (existingPublicId)
            await cloudinary.uploader.destroy(existingPublicId)

          const newUploaderResponse = (await response) as CloudinaryResponse
          existingPost.thumbnail = {
            url: newUploaderResponse.secure_url,
            public_id: newUploaderResponse.public_id,
          }

          await existingPost.save()

          return NextResponse.json({ post: existingPost }, { status: 200 })
        } catch (error) {
          console.log(error)
          return NextResponse.json({ error: error }, { status: 400 })
        }
      }
    }
  } catch (error: any) {
    console.log(error.response.data)
  }
}
