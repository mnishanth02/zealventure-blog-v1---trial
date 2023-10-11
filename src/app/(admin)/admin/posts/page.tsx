import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { z } from 'zod'
import { editorFormSchema } from '@/lib/app.schema'
import PostCard from '@/components/posts/PostCard'

const posts = [
  {
    title: 'Title 01',
    slug: 'title-01',
    meta: 'Meta for Title 01',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/3731983/pexels-photo-3731983.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: ' Mon Oct 10 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
  {
    title: 'Title 02',
    slug: 'title-02',
    meta: 'Meta for Title 02',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/3731990/pexels-photo-3731990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: ' Mon Oct 11 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
  {
    title: 'Title 03',
    slug: 'title-03',
    meta: 'Meta for Title 03',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/3731962/pexels-photo-3731962.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    createdAt: ' Mon Oct 12 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
  {
    title: 'Title 04',
    slug: 'title-04',
    meta: 'Meta for Title 04',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/1048027/pexels-photo-1048027.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: ' Mon Oct 13 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
  {
    title: 'Title 05',
    slug: 'title-05',
    meta: 'Meta for Title 05',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/3094074/pexels-photo-3094074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: ' Mon Oct 14 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
  {
    title: 'Title 06',
    slug: 'title-06',
    meta: 'Meta for Title 06',
    tags: ['posts'],
    thumbnail:
      'https://images.pexels.com/photos/14056515/pexels-photo-14056515.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    createdAt: ' Mon Oct 15 2022 14:00:00 GMT+0530 (India Standared Time)',
  },
]
function Posts() {
  return (
    <section className="max-w-4xl p-2 mx-auto">
      <Tabs defaultValue="allPost" className="">
        <TabsList>
          <TabsTrigger value="allPost">All Posts</TabsTrigger>
          <TabsTrigger value="otherPOsts">Other Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="allPost" className="">
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="otherPOsts">
          <div className="grid grid-cols-3 gap-4">Other POsts</div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default Posts
