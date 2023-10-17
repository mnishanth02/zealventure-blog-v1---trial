import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/Comments'
import Post from '@/models/Post'
import { isValidObjectId } from 'mongoose'

import dbConnect from '@/lib/dbConnect'
import { formatComment, isAuth } from '@/lib/helpers'
import { CommentValidationSchema, validateSchema } from '@/lib/validator'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    return NextResponse.json({ posts: '' }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add Likes for a comment
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

    // const error = validateSchema(CommentValidationSchema, body)
    // if (error) return NextResponse.json({ error }, { status: 422 })

    const { commentId } = body

    if (!isValidObjectId(commentId))
      return NextResponse.json(
        { error: 'Invalid Comment Id!' },
        { status: 422 },
      )
    await dbConnect()

    const comment = await Comment.findById(commentId)
      .populate({
        path: 'owner',
        select: 'name avatar',
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'owner',
          select: 'name avatar',
        },
      })
    if (!comment)
      return NextResponse.json({ error: 'Comment Not Found!' }, { status: 422 })

    const oldLikes = comment.likes || []
    const likedBy = user?.id as any

    // like and unlke

    // Unlike

    if (oldLikes.includes(likedBy)) {
      comment.likes = oldLikes.filter((like) => like.toString() !== likedBy)
    }
    // To like a comment
    else {
      comment.likes = [...oldLikes, likedBy]
    }

    await comment.save()

    return NextResponse.json(
      {
        comment: {
          ...formatComment(comment, user),
          replies: comment.replies?.map((reply: any) =>
            formatComment(reply, user),
          ),
        },
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
