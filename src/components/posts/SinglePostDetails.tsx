'use client'

import { FC } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import parse from 'html-react-parser'
import { signIn } from 'next-auth/react'

import { PostDetails } from '@/types/app'
import { useAuth } from '@/hooks/useAuth'

import CommentForm from '../common/CommentForm'
import { Button } from '../ui/button'

interface SinglePostDetailsProps {
  post: PostDetails
}

const SinglePostDetails: FC<SinglePostDetailsProps> = ({ post }) => {
  const user = useAuth()?.user

  const { title, meta, slug, content, tags, thumbnail, createdAt } = post
  return (
    <section className="max-w-4xl p-4 mx-auto">
      {thumbnail ? (
        <div className="relative aspect-video">
          <Image src={thumbnail} alt={title} fill />
        </div>
      ) : null}
      <h1 className="py-4 text-6xl font-semibold">{title}</h1>
      <div className="flex items-center justify-between">
        {tags.map((t, index) => (
          <span key={t + index}>#{t}</span>
        ))}
        <span>{format(new Date(createdAt), 'd-MMM-yyyy')}</span>
      </div>
      <div className="prose prose-lg dark:prose-invert ">
        {content ? parse(content) : ''}
      </div>
      <div className="py-20">
        {user ? (
          <CommentForm title="Add Comment" />
        ) : (
          <div className="flex flex-col items-end space-y-2">
            <h3 className="text-xl font-semibold">Login to add comment</h3>
            <Button onClick={async () => await signIn()}>Login</Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default SinglePostDetails
