'use client'

import React, { FC, useEffect, useRef } from 'react'
import { getPostsQueryFn } from '@/queryFns/postsQueryFns'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'

import { PostDetails } from '@/types/app'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PostCard from '@/components/posts/PostCard'

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

  const _posts = data?.pages.flatMap((page) => page)

  return (
    <section className="max-w-5xl p-2 mx-auto ">
      <Tabs defaultValue="allPost" className="">
        <TabsList>
          <TabsTrigger value="allPost">All Posts</TabsTrigger>
          <TabsTrigger value="otherPosts">Other Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="allPost" className="">
          <div className="grid grid-cols-3 gap-4">
            {_posts.map((post, i) => {
              return (
                <div ref={i === _posts.length - 1 ? ref : null} key={post.slug}>
                  <PostCard post={post} />
                </div>
              )
            })}

            {/* {hasNextPage ? (
              <button onClick={() => fetchNextPage()}>Load More</button>
            ) : null} */}
          </div>
          {isFetchingNextPage && (
            <p className="p-3 text-xl font-semibold text-center opacity-50 animate-pulse">
              Loading more...
            </p>
          )}
        </TabsContent>
        <TabsContent value="otherPosts">
          <div className="grid grid-cols-3 gap-4">Other POsts</div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default PostsList
