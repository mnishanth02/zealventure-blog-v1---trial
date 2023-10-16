'use client'

import { useSession } from 'next-auth/react'

import { UserProfile } from '@/types/app'

export const useAuth = () => {
  const { data, status } = useSession()
  const user = data?.user

  if (user) return { user, status } as { user: UserProfile; status: string }
}
