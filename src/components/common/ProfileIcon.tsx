import { FC } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface ProfileIconProps {
  avatar?: string
  nameInitial?: string
}

const ProfileIcon: FC<ProfileIconProps> = ({ avatar, nameInitial }) => {
  return (
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>{nameInitial}</AvatarFallback>
    </Avatar>
  )
}

export default ProfileIcon
