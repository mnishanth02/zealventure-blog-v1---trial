'use client'

import { FC } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { signIn } from 'next-auth/react'

import { CommentResponse } from '@/types/app'
import { useAuth } from '@/hooks/useAuth'

import { Button } from '../ui/button'
import CommentCard from './CommentCard'
import CommentForm from './CommentForm'

interface CommentsProps {
  belongsTo: string
}

const Comments: FC<CommentsProps> = ({ belongsTo }) => {
  const queryClient = useQueryClient()
  const user = useAuth()?.user

  const fetchComments = async () => {
    return (await axios(`/api/comment?belongsTo=${belongsTo}`)).data?.comments
  }

  const {
    data: allcomments = [],
    isLoading: isCommentsLoading,
    isError,
  } = useQuery<CommentResponse[]>({
    queryKey: ['comments'],
    queryFn: fetchComments,
    onSuccess: (data) => {
      console.log('comments from fetch->', data)
    },
  })

  const createComments = async (content: string) => {
    return (await axios.post('/api/comment', { content, belongsTo })).data
      ?.comment
  }

  const createReplyComments = async (replyContent: any) => {
    return (await axios.post('/api/comment/reply', replyContent)).data?.comment
  }
  const patchComment = async ({ content, id }: any) => {
    return (await axios.patch(`/api/comment?commentId=${id}`, { content })).data
      ?.comment
  }
  const deleteComment = async (commentId: string) => {
    return (await axios.delete(`/api/comment?commentId=${commentId}`)).data
  }
  const likeComment = async (commentId: string) => {
    return (await axios.post(`/api/comment/likes`, { commentId })).data?.comment
  }

  const { mutate: postCommentMutation, isLoading } = useMutation({
    mutationFn: createComments,
    onSuccess: (data) => {
      console.log('sucess-> ', data)
      queryClient.invalidateQueries(['comments'])
    },

    onError: () => {
      console.log('Error ')
    },
  })

  const { mutate: postReplyCommentMutation, isLoading: isReplySubmitting } =
    useMutation({
      mutationFn: createReplyComments,
      onSuccess: (data) => {
        console.log('sucess-> ', data)
        queryClient.invalidateQueries(['comments'])
      },

      onError: () => {
        console.log('Error ')
      },
    })

  const { mutate: patchCommentMutation, isLoading: isPatchLoading } =
    useMutation({
      mutationFn: patchComment,
      onSuccess: (data) => {
        console.log('sucess-> ', data)
        queryClient.invalidateQueries(['comments'])
      },

      onError: () => {
        console.log('Error ')
      },
    })

  const { mutate: deleteCommentMutation, isLoading: isdeletLoading } =
    useMutation({
      mutationFn: deleteComment,
      onSuccess: (data) => {
        console.log('sucess-> ', data)
        queryClient.invalidateQueries(['comments'])
      },

      onError: () => {
        console.log('Error ')
      },
    })

  const { mutate: likeCommentMutation, isLoading: islikeloading } = useMutation(
    {
      mutationFn: likeComment,
      onSuccess: (data) => {
        console.log('sucess-> ', data)
        queryClient.invalidateQueries(['comments'])
      },

      onError: () => {
        console.log('Error ')
      },
    },
  )

  const submitHandler = (content: string) => {
    console.log('content->', content)
    postCommentMutation(content)
  }

  const handleReplySubmit = (replyComment: {
    content: string
    repliedTo: string
  }) => {
    postReplyCommentMutation(replyComment)
  }

  const handleUpdateSubmit = (content: string, id: string) => {
    patchCommentMutation({ content, id })
  }
  const handleOnDelete = (comment: CommentResponse) => {
    deleteCommentMutation(comment.id)
  }
  const handleOnLikeClick = (comment: CommentResponse) => {
    likeCommentMutation(comment.id)
  }

  return (
    <div className="py-20 space-y-4">
      {user ? (
        <CommentForm
          title="Add Comment"
          isLoading={isLoading}
          onSubmit={submitHandler}
        />
      ) : (
        <div className="flex flex-col items-end space-y-2">
          <h3 className="text-xl font-semibold">Login to add comment</h3>
          <Button onClick={async () => await signIn()}>Login</Button>
        </div>
      )}

      {allcomments &&
        allcomments?.map((comment) => {
          const { replies } = comment

          return (
            <div key={comment.id}>
              <CommentCard
                showControls={user?.id === comment.owner.id}
                onReplySubmit={(content) =>
                  handleReplySubmit({ content, repliedTo: comment.id })
                }
                onUpdateSubmit={(content) =>
                  handleUpdateSubmit(content, comment.id)
                }
                onLikeClick={() => handleOnLikeClick(comment)}
                onDelete={() => handleOnDelete(comment)}
                comment={comment}
              />

              {replies?.length ? (
                <div className="w-[90%] ml-auto space-y-3">
                  <h1 className="mb-3">Replies</h1>
                  {replies.map((reply) => {
                    return (
                      <CommentCard
                        showControls={user?.id === comment.owner.id}
                        key={reply.id}
                        comment={reply}
                        onUpdateSubmit={(content) =>
                          handleUpdateSubmit(content, reply.id)
                        }
                        onLikeClick={() => handleOnLikeClick(reply)}
                        onReplySubmit={(content) =>
                          handleReplySubmit({ content, repliedTo: comment.id })
                        }
                        onDelete={() => handleOnDelete(reply)}
                      />
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
    </div>
  )
}

export default Comments
