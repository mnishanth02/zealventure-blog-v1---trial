import { FC, useState } from 'react'
import { format } from 'date-fns'
import parse from 'html-react-parser'
import {
  BsFillReplyAllFill,
  BsFillTrashFill,
  BsPencilSquare,
} from 'react-icons/bs'

import { CommentResponse } from '@/types/app'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '../ui/button'
import AlertDialogCustom from './AlertDialogCustom'
import CommentForm from './CommentForm'
import LikeHeart from './LikeHeart'
import ProfileIcon from './ProfileIcon'

interface CommentCardProps {
  comment: CommentResponse
  showControls?: boolean
  onUpdateSubmit?(content: string): void
  onReplySubmit?(content: string): void
  onDelete(): void
  onLikeClick(): void
}

const CommentCard: FC<CommentCardProps> = ({
  comment,
  showControls = false,
  onUpdateSubmit,
  onReplySubmit,
  onDelete,
  onLikeClick,
}) => {
  const {
    owner: { name, avatar },
    content,
    createdAt,
    likedByOwner,
    likes,
  } = comment

  const [showReplyForm, setSetshowReplyForm] = useState(false)
  const [initialState, setInitialState] = useState('')

  const handleCommentSubmit = (comment: string) => {
    // means we want to update
    if (initialState) {
      onUpdateSubmit && onUpdateSubmit(comment)
    } else {
      // means we want to reply
      onReplySubmit && onReplySubmit(comment)
    }
    hideReplyForm()
  }

  const displayReplyForm = () => {
    setInitialState('')
    setSetshowReplyForm(true)
  }

  const hideReplyForm = () => {
    setSetshowReplyForm(false)
  }

  const handleOnReplyClick = () => {
    displayReplyForm()
  }

  const handleOnEditClick = () => {
    displayReplyForm()
    setInitialState(content)
  }
  return (
    <div className="flex space-x-3">
      <ProfileIcon avatar={avatar} nameInitial={name[0].toLocaleUpperCase()} />

      <div className="items-center flex-1">
        <h1 className="text-lg font-semibold">{name}</h1>
        <span className="text-sm ">
          {format(new Date(createdAt), 'dd-MMM-yyyy')}
        </span>
        <div>{parse(content)}</div>
        <div className="flex">
          <LikeHeart
            liked={likedByOwner}
            label={likes + ' likes'}
            onClick={onLikeClick}
          />
          <CustomButton onClick={handleOnReplyClick}>
            <BsFillReplyAllFill />
            <span>Reply</span>
          </CustomButton>
          {showControls && (
            <>
              <CustomButton onClick={handleOnEditClick}>
                <BsPencilSquare />
                <span>Edit</span>
              </CustomButton>

              <AlertDialog>
                <AlertDialogTrigger asChild disabled={false}>
                  <CustomButton onClick={() => {}}>
                    <BsFillTrashFill />
                    <span>Delete</span>
                  </CustomButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogCustom
                    title="Are you sure?"
                    content="This action will remove this comment permanently!"
                    handleDelete={onDelete}
                    // loading={isloading}
                  />
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>

        <div className="mt-3">
          {showReplyForm && (
            <CommentForm
              onSubmit={handleCommentSubmit}
              onClose={hideReplyForm}
              title="Add your Reply"
              initialState={initialState}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentCard

interface CustomButtonProps {
  children: React.ReactNode
  onClick(): void
}

const CustomButton = ({ children, onClick }: CustomButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant={'ghost'}
      size={'sm'}
      className="flex items-center space-x-2"
    >
      {children}
    </Button>
  )
}
