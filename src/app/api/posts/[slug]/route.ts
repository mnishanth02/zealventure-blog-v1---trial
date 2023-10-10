import { editorFormSchema } from '@/lib/app.schema'
import dbConnect from '@/lib/dbConnect'
import Post from '@/models/Post'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const GET = async (
  request: Request,
  { params }: { params: { slug: string } },
) => {
  const { slug } = params
  console.log('params', slug)

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
