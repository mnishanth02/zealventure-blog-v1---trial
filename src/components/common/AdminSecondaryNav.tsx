'use client'

import { FC } from 'react'
import { useSession } from 'next-auth/react'

import { UserProfile } from '@/types/app'

import Profile from './Profile'
import SearchBar from './SearchBar'

interface AdminSecondaryNavProps {}

const AdminSecondaryNav: FC<AdminSecondaryNavProps> = ({}) => {
  const { data, status } = useSession()
  const profile = data?.user as UserProfile | undefined

  const isAdmin = profile && profile.role === 'admin'
  return (
    <nav className="flex items-center justify-between">
      <SearchBar />
      <Profile isAdmin={isAdmin} />
    </nav>
  )
}

export default AdminSecondaryNav
