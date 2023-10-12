'use client'
import { FC, useEffect, useRef } from 'react'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostCard from '@/components/posts/PostCard'
import { PostDetails } from '@/types/app'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getPostsQueryFn } from '@/queryFns/postsQueryFns'
import { useIntersection } from '@mantine/hooks'

interface PostsListProps {}

const PostsList: FC<PostsListProps> = ({}) => {
  const lastPostRef = useRef<HTMLElement>(null)
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteQuery<PostDetails[]>({
      queryKey: ['posts'],
      queryFn: getPostsQueryFn,
      getNextPageParam: (_, pages) => pages.length + 1,
    })

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage()
  }, [entry, fetchNextPage])
  if (!data) return <div>Loading...</div>

  const _posts = data?.pages.flatMap(page => page)

  return (
    <section className="p-2 mx-auto max-w-7xl ">
      <Tabs defaultValue="allPost" className="">
        <TabsList>
          <TabsTrigger value="allPost">All Posts</TabsTrigger>
          <TabsTrigger value="otherPosts">Other Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="allPost" className="">
          <div className="grid grid-cols-3 gap-4">
            {_posts.map((post, i) => {
              if (i === _posts.length - 1) {
                return (
                  <div ref={ref} key={post.slug}>
                    <PostCard post={post} />
                  </div>
                )
              } else {
                return <PostCard key={post.slug} post={post} />
              }
            })}
            {/* Lode more button for manual Fetching */}
            {/* {isFetchingNextPage ? (
              <div>Loading more...</div>
            ) : hasNextPage ? (
              <button onClick={() => fetchNextPage()}>Load More</button>
            ) : null} */}
          </div>
        </TabsContent>
        <TabsContent value="otherPosts">
          <div className="grid grid-cols-3 gap-4">Other POsts</div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default PostsList
