'use client'

import { FC } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { UserProfile } from '@/types/app'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '../ui/button'
import Profile from './Profile'
import SearchBar from './SearchBar'

interface AdminSecondaryNavProps {}

const AdminSecondaryNav: FC<AdminSecondaryNavProps> = ({}) => {
  const { data, status } = useSession()
  const { setTheme, theme } = useTheme()

  const profile = data?.user as UserProfile | undefined

  const isAdmin = profile && profile.role === 'admin'
  return (
    <nav className="flex items-center justify-between">
      <SearchBar />
      <div className="flex items-center justify-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Profile isAdmin={isAdmin} />
      </div>
    </nav>
  )
}

export default AdminSecondaryNav
