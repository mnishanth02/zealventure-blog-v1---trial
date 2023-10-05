import { FC } from 'react'
import NextImage from 'next/image'
import CheckMark from '@/components/common/CheckMark'

interface ImageProps {
  src: string
  selected?: boolean
  onClick?(): void
}

const ImageG: FC<ImageProps> = ({ src, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded cursor-pointer"
    >
      <NextImage
        src={src}
        width={200}
        height={200}
        className="transition hover:scale-110"
        alt="gallery"
      />
      <div className="absolute top-2 left-2">
        <CheckMark visible={selected || false} />
      </div>
    </div>
  )
}

export default ImageG
