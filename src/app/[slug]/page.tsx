import { FC } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Post from '@/models/Post'

import { PostDetails } from '@/types/app'
import dbConnect from '@/lib/dbConnect'
import DefaultLayout from '@/components/common/DefaultLayout'
import SinglePostDetails from '@/components/posts/SinglePostDetails'

interface SinglePostProps {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: SinglePostProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await getPost(params)

  return {
    title: post.title,
    description: post.meta,
  }
}

export async function generateStaticParams() {
  try {
    await dbConnect()
    const posts = await Post.find().select('slug')
    return posts.map(({ slug }) => slug)
  } catch (error) {
    return [{ slug: '/' }]
  }
}

async function getPost(params: { slug: string }) {
  try {
    await dbConnect()
    const post = await Post.findOne({ slug: params.slug })

    if (!post) {
      notFound()
    }
    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      meta: post.meta,
      slug: post.slug,
      tags: post.tags,
      thumbnail: post.thumbnail?.url || '',
      createdAt: post.createdAt.toString(),
    } as PostDetails
  } catch (error) {
    console.log(error)
    notFound()
  }
}

const SinglePost: FC<SinglePostProps> = async ({ params }) => {
  const post = await getPost(params)

  return <DefaultLayout>

   <SinglePostDetails post={post}/>
  </DefaultLayout>
}

export default SinglePost
