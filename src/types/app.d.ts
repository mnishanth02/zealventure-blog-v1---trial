export type CloudinaryResponse = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  access_mode: string
  original_filename: string
  api_key: string
}

export type PostDetails = {
  id: string
  title: string
  slug: string
  content?: string
  meta: string
  tags: string[]
  thumbnail?: string
  createdAt: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string | undefined
  role: 'user' | 'admin'
}

export type replyComments = CommentResponse[]

export interface CommentResponse {
  id: string
  content: string
  createdAt: string
  likes: number
  likedByOwner?: boolean
  replies?: replyComments
  repliedTo?: string
  chiefComment: boolean
  owner: { name: string; id: string; avatar?: string } | null
}
