import { FC } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import parse from 'html-react-parser'

import { PostDetails } from '@/types/app'

interface SinglePostDetailsProps {
  post: PostDetails
}

const SinglePostDetails: FC<SinglePostDetailsProps> = ({ post }) => {
  const { title, meta, slug, content, tags, thumbnail, createdAt } = post
  return (
    <section className="max-w-4xl p-4 pb-20 mx-auto">
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
    </section>
  )
}

export default SinglePostDetails
