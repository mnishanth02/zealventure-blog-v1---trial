import Tiptap from '@/components/editor/TipTap'
import { FC } from 'react'

interface updatePostProps {
  params: { slug: string }
}

const UpdatePost: FC<updatePostProps> = ({ params }) => {
  const { slug } = params

  return (
    <div className="max-w-4xl mx-auto">
      <Tiptap slug={slug} buttonTitle="Update" />
    </div>
  )
}

export default UpdatePost
