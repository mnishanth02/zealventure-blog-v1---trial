import { FC } from 'react'
import { BsCheckLg } from 'react-icons/bs'

interface CheckMarkProps {
  visible: boolean
}

const CheckMark: FC<CheckMarkProps> = ({ visible }) => {
  if (!visible) return null
  return (
    <div className="p-1 rounded-full backdrop-blur-sm bg-primary text-primary-foreground bg-opacity-70">
      <BsCheckLg />
    </div>
  )
}

export default CheckMark
