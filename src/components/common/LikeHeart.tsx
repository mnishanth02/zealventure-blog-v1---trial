import { FC } from 'react'
import { BsHeart, BsHeartFill } from 'react-icons/bs'

import { Button } from '../ui/button'

interface LikeHeartProps {
  loading?: boolean
  label?: string
  liked?: boolean
  onClick?(): void
}

const LikeHeart: FC<LikeHeartProps> = ({
  label,
  liked = false,
  loading,
  onClick,
}) => {
  return (
    <Button
      type="button"
      variant={'ghost'}
      size={'sm'}
      className="flex items-center space-x-2"
      onClick={onClick}
    >
      {liked ? <BsHeartFill color="#4790FD" /> : <BsHeart />}
      <span>{label}</span>
    </Button>
  )
}

export default LikeHeart
