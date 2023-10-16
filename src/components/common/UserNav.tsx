'use client';

import { FC } from 'react';
import Link from 'next/link';
import { Moon, Sun } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTheme } from 'next-themes'

import { useAuth } from '@/hooks/useAuth'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import Logo from './Logo'
import LogoLight from './LogoLight'
import Profile from './Profile'

interface UserNavProps {}

const UserNav: FC<UserNavProps> = ({}) => {
  const { setTheme, theme } = useTheme()

  const auth = useAuth()
  const isAdmin = auth?.user && auth?.user.role === 'admin'
  const isAuth = auth?.status === 'authenticated'

  return (
    <nav className="flex items-center justify-between p-2 bg-secondary">
      <Link href={'/'} className="flex items-center">
        {theme === 'dark' ? <LogoLight /> : <Logo />}
      </Link>
      <div className="flex items-center justify-between space-x-4">
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

        {isAuth ? (
          <Profile isAdmin={isAdmin} user={auth?.user || null} />
        ) : (
          <Button onClick={async () => await signIn()}>Login</Button>
        )}
      </div>
    </nav>
  )
}

export default UserNav