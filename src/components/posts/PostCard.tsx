'use client'

import { FC, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { format } from 'date-fns'

import { PostDetails } from '@/types/app'
import { trimText } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import PostCardFooter from '../common/PostCardFooter'

interface PostCardProps {
  post: PostDetails
  index?: number
}

const PostCard: FC<PostCardProps> = ({ post, index }) => {
  const [deletingPostId, setDeletingPostId] = useState('')

  const queryClient = useQueryClient()
  const { title, thumbnail, meta, slug, tags, createdAt } = post

  const user = useAuth()?.user
  const isAdmin = user && user.role === 'admin'

  const deletePost = async (post: PostDetails) => {
    await axios.delete(`/api/posts/${post.id}`)
  }

  const { mutate: deleteMutation, isLoading: isDeleting } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setDeletingPostId('')
      queryClient.invalidateQueries(['posts'])
    },
    onError: () => {
      console.log('Error ')
    },
  })

  const deleteHandler = () => {
    deleteMutation(post)
    setDeletingPostId(post.id)
  }

  return (
    <Card
      className={`flex flex-col justify-between h-full ${
        deletingPostId === post.id && isDeleting ? 'animate-pulse' : ''
      } `}
    >
      <CardHeader>
        <Link href={'/' + slug}>
          <CardTitle>{trimText(title, 50)}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-md aspect-video">
          {!thumbnail ? (
            <Link
              href={'/' + slug}
              className="flex items-center justify-center w-full h-full font-semibold opacity-50"
            >
              No Image
            </Link>
          ) : (
            <Link href={'/' + slug}>
              <Image
                src={thumbnail as string}
                fill
                alt="Image"
                sizes="auto"
                className="object-cover transition-all rounded-md hover:scale-105"
              />
            </Link>
          )}
        </div>
        <div className="flex flex-col flex-1 p-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              {tags.map((tag, index) => (
                <span key={tag + index}>#{tag}</span>
              ))}
            </div>
            <span>{format(new Date(createdAt), 'd-MMM-yyyy')}</span>
          </div>
        </div>
        <CardDescription> {trimText(meta, 70)}</CardDescription>
      </CardContent>
      {isAdmin && (
        <PostCardFooter
          onDelete={deleteHandler}
          isloading={isDeleting}
          slug={slug}
        />
      )}
    </Card>
  )
}

export default PostCard
