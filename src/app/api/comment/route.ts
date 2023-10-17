import { NextRequest, NextResponse } from 'next/server'
import Comment from '@/models/Comments'
import Post from '@/models/Post'
import { isValidObjectId } from 'mongoose'

import { CommentResponse } from '@/types/app'
import dbConnect from '@/lib/dbConnect'
import { formatComment, isAuth } from '@/lib/helpers'
import { CommentValidationSchema, validateSchema } from '@/lib/validator'

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await isAuth()
    const belongsTo = req.nextUrl.searchParams.get('belongsTo')

    if (!belongsTo || !isValidObjectId(belongsTo))
      return NextResponse.json({ error: 'Invalid Request' }, { status: 422 })

    const comments = await Comment.find({ belongsTo })
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
      .select('createdAt likes content repliedTo')

    if (!comments)
      return NextResponse.json({ error: 'Comment Not Found' }, { status: 404 })

    const formatedComment = comments.map((comment) => {
      return {
        ...formatComment(comment, user),
        replies: comment.replies?.map((c: any) => formatComment(c, user)),
      }
    }) as CommentResponse[]

    return NextResponse.json({ comments: formatedComment }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add New Comments
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

    await dbConnect()

    const { belongsTo, content } = body

    const post = await Post.findById(belongsTo)
    console.log('Post', post)

    if (!post)
      return NextResponse.json({ error: 'Invalid Post' }, { status: 401 })

    const comment = new Comment({
      owner: user?.id,
      chiefComment: true,
      content,
      belongsTo,
    })

    await comment.save()
    const commentWithOwner = await comment.populate('owner')

    return NextResponse.json(
      { comment: formatComment(commentWithOwner, user) },
      { status: 201 },
    )
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// if a chiefComment is removed - remove other replies as well.
// if this is a reply comment then remove from other chief comments repliess,
// then remove the actual comment
export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await isAuth()
    if (!user)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    const commentId = req.nextUrl.searchParams.get('commentId')
    console.log('Comment ID _>', commentId)

    if (!commentId || !isValidObjectId(commentId))
      return NextResponse.json({ error: 'Invalid Request' }, { status: 422 })
    await dbConnect()

    const comment = await Comment.findOne({
      _id: commentId,
      owner: user?.id,
    })

    if (!comment)
      return NextResponse.json({ error: 'Comment Not Found' }, { status: 404 })

    // if a chiefComment is removed - remove other replies as well.
    if (comment.chiefComment) await Comment.deleteMany({ repliedTo: commentId })
    else {
      const chiefComment = await Comment.findById(comment.repliedTo)

      // if this is a reply comment then remove from other chief comments repliess,
      if (chiefComment?.replies?.includes(commentId as any)) {
        chiefComment.replies = chiefComment.replies.filter(
          (cId) => cId !== (commentId as any),
        )
        await chiefComment.save()
      }
    }

    // then remove the actual comment
    await Comment.findByIdAndDelete(commentId)

    return NextResponse.json({ removed: true }, { status: 200 })
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//  Update a Comment

export const PATCH = async (req: NextRequest, res: NextResponse) => {
  try {
    const user = await isAuth()
    if (!user)
      return NextResponse.json(
        { error: 'Unauthorized request!' },
        { status: 401 },
      )

    const body = await req.json()
    const commentId = req.nextUrl.searchParams.get('commentId')

    console.log(body)
    console.log('Comment ID _>', commentId)

    const error = validateSchema(CommentValidationSchema, body)
    if (error) return NextResponse.json({ error }, { status: 422 })

    if (!commentId || !isValidObjectId(commentId))
      return NextResponse.json({ error: 'Invalid Request' }, { status: 422 })

    await dbConnect()

    const comment = await Comment.findOne({
      _id: commentId,
      owner: user?.id,
    }).populate('owner')

    if (!comment)
      return NextResponse.json({ error: 'Comment Not Found' }, { status: 404 })

    const { content } = body

    comment.content = content
    await comment.save()

    return NextResponse.json(
      { comment: formatComment(comment, user) },
      { status: 201 },
    )
  } catch (error: any) {
    console.log('error-> ', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
