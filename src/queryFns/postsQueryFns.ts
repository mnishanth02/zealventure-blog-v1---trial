import { PostDetails } from '@/types/app'
import axios from 'axios'

export const getPostsQueryFn = async ({ pageParam = 1 }) =>
  axios
    .get(`/api/posts`, {
      params: { limit: '9', pageNo: pageParam - 1 },
    })
    .then(res => {
      return res.data.posts as PostDetails[]
    })
