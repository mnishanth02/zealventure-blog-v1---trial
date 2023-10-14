import React from 'react'
import { getPostsQueryFn } from '@/queryFns/postsQueryFns'
import { dehydrate } from '@tanstack/react-query'

import getQueryClient from '@/lib/getQueryClient'
import UserNav from '@/components/common/UserNav'
import PostsList from '@/components/posts/PostsList'
import { ReactQueryHydrate } from '@/components/providers/ReactQueryHydrate'
import DefaultLayout from '@/components/common/DefaultLayout'

export default async function Home() {
  const queryClient = getQueryClient()
  await queryClient.prefetchInfiniteQuery(['posts'], getPostsQueryFn)
  const dehydratedState = dehydrate(queryClient)

  return (
    <DefaultLayout>
        <ReactQueryHydrate state={dehydratedState}>
          <PostsList />
        </ReactQueryHydrate>
    </DefaultLayout>
  )
}
