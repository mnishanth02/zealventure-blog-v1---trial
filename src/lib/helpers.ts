// Helpers for API
import { Readable } from 'stream'
import { NextApiRequest } from 'next'
import { CommentModelSchema } from '@/models/Comments'
import Post, { PostModelSchema } from '@/models/Post'
import { UploadApiResponse } from 'cloudinary'
import formidable from 'formidable'
import { ObjectId } from 'mongoose'
import { getServerSession } from 'next-auth'

import { CommentResponse, PostDetails, UserProfile } from '@/types/app'
import { options } from '@/app/api/auth/[...nextauth]/options'

import cloudinary from './cloudinary'
import dbConnect from './dbConnect'

export const formatPosts = (posts: PostModelSchema[]): PostDetails[] => {
  return posts.map((post) => ({
    id: post?._id.toString(),
    title: post.title,
    slug: post.slug,
    tags: post.tags,
    meta: post.meta,
    thumbnail: post.thumbnail?.url || '',
    createdAt: post.createdAt.toString(),
  }))
}

export const readPostFromDb = async (limit: number = 9, pageNo: number = 0) => {
  if (!limit || limit > 10)
    throw Error('Please use Limit under 10 and a valid Page No')
  const skip = limit * pageNo

  try {
    await dbConnect()
    const posts = await Post.find()
      .sort({ createdAt: 'desc' })
      .select('-content')
      .skip(skip)
      .limit(limit)

    return posts
  } catch (error) {
    console.log('Error->', error)
  }
}

export const isAdmin = async () => {
  const session = await getServerSession(options)
  const user = session?.user as UserProfile
  return user && user.role === 'admin'
}

export const isAuth = async () => {
  const session = await getServerSession(options)
  const user = session?.user
  if (user) return user as UserProfile
}

const getLikedByOwner = (likes: any[], user: UserProfile) =>
  likes.includes(user.id)

export const formatComment = (
  comment: CommentModelSchema,
  user?: UserProfile,
): CommentResponse => {
  const owner = comment.owner as any
  return {
    id: comment._id as unknown as string,
    content: comment.content,
    likes: comment.likes.length,
    chiefComment: comment?.chiefComment || false,
    createdAt: comment.createdAt?.toString(),
    owner: { id: owner.id, name: owner.name, avatar: owner.avatar },
    repliedTo: comment?.repliedTo as unknown as string,
    likedByOwner: user ? getLikedByOwner(comment.likes, user) : false,
  }
}

export async function uploadStream(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((res, rej) => {
    const theTransformStream = cloudinary.uploader.upload_stream(
      {
        folder: 'zealventure/blog',
        upload_preset: 'yeqhjlwt',
        use_filename: true,
        chunk_size: 10000,
        resource_type: 'image',
      },
      (err, result) => {
        if (err) return rej(err)
        if (result) res(result)
      },
    )
    let str = Readable.from(buffer)
    str.pipe(theTransformStream)
  })
}

export async function uploadFile(fileString: string) {
  return await cloudinary.uploader.upload(fileString, {
    folder: 'zealventure/blog',
    upload_preset: 'yeqhjlwt',
    use_filename: true,
    resource_type: 'image',
    chunk_size: 100000,
  })
}

interface FormidablePromise<T> {
  files: formidable.Files
  body: T
}

export const readFile = <T extends object>(
  req: NextApiRequest,
): Promise<FormidablePromise<T>> => {
  const form = formidable()
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)

      resolve({ files, body: fields as T })
    })
  })
}
