import axios from 'axios'

import { PostDetails } from '@/types/app'

export const getPostsQueryFn = async ({ pageParam = 1 }) =>
  axios
    .get(`/api/posts`, {
      params: { limit: '9', pageNo: pageParam - 1 },
    })
    .then((res) => {
      return res.data.posts as PostDetails[]
    })

export const getSinglePostQueryFn = async (slug: string) => {
  axios.get(`/api/posts/${slug}`).then((res) => res.data.posts as PostDetails)
}
