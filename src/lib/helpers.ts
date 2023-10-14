// Helpers for API
import Post, { PostModelSchema } from '@/models/Post'

import { PostDetails } from '@/types/app'

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
