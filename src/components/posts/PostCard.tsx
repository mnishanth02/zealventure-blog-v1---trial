import { PostDetails } from '@/types/app'
import { FC } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '../ui/button'
import Image from 'next/image'
import { format } from 'date-fns'
import { trimText } from '@/lib/utils'
import Link from 'next/link'
import { Pencil, Trash2 } from 'lucide-react'

interface PostCardProps {
  post: PostDetails
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const { title, thumbnail, meta, slug, tags, createdAt } = post
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <Link href={'/admin/posts/' + slug}>
          <CardTitle>{trimText(title, 50)}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-md aspect-video">
          {!thumbnail ? (
            <div className="flex items-center justify-center w-full h-full font-semibold opacity-50">
              No Image
            </div>
          ) : (
            <Link href={'/admin/posts/' + slug}>
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
      <CardFooter className="flex justify-end space-x-2">
        <Link href={'/admin/posts/update/' + slug}>
          <Button variant="secondary" size={'icon'}>
            <Trash2 size={20} />
          </Button>
        </Link>
        <Link href={'/admin/posts/update/' + slug}>
          <Button size={'icon'}>
            <Pencil size={20} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default PostCard
