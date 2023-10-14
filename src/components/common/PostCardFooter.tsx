import { FC } from 'react'
import Link from 'next/link'
import { Loader2, Pencil, Trash2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import AlertDialogCustom from './AlertDialogCustom'

interface PostCardFooterProps {
  slug: string
  isloading?: boolean
  onDelete(): void
}

const PostCardFooter: FC<PostCardFooterProps> = ({
  slug,
  isloading,
  onDelete,
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2">
      <AlertDialog>
        <AlertDialogTrigger asChild disabled={isloading}>
          <Button variant="secondary" size={'icon'}>
            {isloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogCustom
            title="Are you sure?"
            content="This action will remove this post permanently!"
            handleDelete={onDelete}
            loading={isloading}
          />
        </AlertDialogContent>
      </AlertDialog>

      <Button size={'icon'} disabled={isloading}>
        <Link href={'/admin/posts/update/' + slug}>
          <Pencil size={20} />
        </Link>
      </Button>
    </CardFooter>
  )
}

export default PostCardFooter
