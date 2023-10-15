import React from 'react'
import { getPostsQueryFn } from '@/queryFns/postsQueryFns'
import { dehydrate } from '@tanstack/react-query'

import getQueryClient from '@/lib/getQueryClient'
import PostsList from '@/components/posts/PostsList'
import { ReactQueryHydrate } from '@/components/providers/ReactQueryHydrate'

async function Posts() {
  // const queryClient = getQueryClient()
  // await queryClient.prefetchInfiniteQuery(['posts'], getPostsQueryFn)
  // const dehydratedState = dehydrate(queryClient)

  return (
    // <ReactQueryHydrate state={dehydratedState}>
    <ReactQueryHydrate>
      <PostsList />
    </ReactQueryHydrate>
  )
}

export default Posts
