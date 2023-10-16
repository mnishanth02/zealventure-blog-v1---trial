import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/Comments'
import Post from '@/models/Post'
import { isValidObjectId } from 'mongoose'

import dbConnect from '@/lib/dbConnect'
import { formatPosts, isAuth, readPostFromDb } from '@/lib/helpers'
import { CommentValidationSchema, validateSchema } from '@/lib/validator'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    return NextResponse.json({ posts: '' }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add New Reply to a comment
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await isAuth()
    if (!user)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    const body = await req.json()
    console.log(body)

    const error = validateSchema(CommentValidationSchema, body)
    if (error) return NextResponse.json({ error }, { status: 422 })

    const { content, repliedTo } = body

    if (!isValidObjectId(repliedTo))
      return NextResponse.json(
        { error: 'Invalid Comment Id!' },
        { status: 422 },
      )
    await dbConnect()

    const chiefComment = await Comment.findOne({
      _id: repliedTo,
      chiefComment: true,
    })
    if (!chiefComment)
      return NextResponse.json({ error: 'Comment Not Found!' }, { status: 422 })

    const replyComment = new Comment({
      owner: user?.id,
      repliedTo,
      content,
    })

    if (chiefComment.replies)
      chiefComment.replies = [...chiefComment.replies, replyComment._id]

    await chiefComment.save()
    await replyComment.save()

    return NextResponse.json({ comment: replyComment }, { status: 201 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
