import React from 'react'
import { dehydrate } from '@tanstack/react-query'
import { getPostsQueryFn } from '@/queryFns/postsQueryFns'
import { ReactQueryHydrate } from '@/components/providers/ReactQueryHydrate'
import getQueryClient from '@/lib/getQueryClient'
import PostsList from '@/components/posts/PostsList'

async function Posts() {
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(['posts'], getPostsQueryFn)
  const dehydratedState = dehydrate(queryClient)

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <PostsList />
    </ReactQueryHydrate>
  )
}

export default Posts
