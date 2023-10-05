import { FC } from 'react'
import ImageG from './ImageG'
import { BsCardImage } from 'react-icons/bs'

/*images*/

interface GalleryProps {
  images: { src: string }[]
  onSelect(src: string): void
  uploading?: boolean
  selectedImage?: string
}

const Gallery: FC<GalleryProps> = ({
  images,
  uploading = false,
  selectedImage = '',
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap">
      {uploading && (
        <div className="flex flex-col items-center justify-center p-1 rounded animate-pulse basis-1/4 aspect-square">
          <BsCardImage size={60} />
          <p>Uploading...</p>
        </div>
      )}
      {images.map(({ src }, index) => {
        return (
          <div key={index} className="p-2 basis-1/4">
            <ImageG
              src={src}
              selected={selectedImage === src}
              onClick={() => onSelect(src)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default Gallery
