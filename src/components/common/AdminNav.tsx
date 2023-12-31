'use client'

import { FC, useState } from 'react'
import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { LuLayoutDashboard, LuMails, LuUsers } from 'react-icons/lu'
import { MdOutlineArticle } from 'react-icons/md'
import { RiMenuFoldFill, RiMenuUnfoldFill } from 'react-icons/ri'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import Logo from './Logo'
import LogoLight from './LogoLight'
import ZeLogo from './ZeLogo'

export interface AdminNavProps {}

const navItems = [
  { href: '/admin', icon: <LuLayoutDashboard size={24} />, label: 'Dashboard' },
  {
    href: '/admin/posts',
    icon: <MdOutlineArticle size={24} />,
    label: 'Posts',
  },
  { href: '/admin/users', icon: <LuUsers size={24} />, label: 'Users' },
  { href: '/admin/comments', icon: <LuMails size={24} />, label: 'Comments' },
]

const AdminNav: FC<AdminNavProps> = ({}) => {
  const [open, setOpen] = useState(true)
  const { setTheme, theme } = useTheme()

  return (
    <nav
      className={`flex flex-col sticky top-0 duration-300 overflow-hidden  justify-between h-screen shadow-sm ${
        open ? 'w-60' : 'w-20'
      }  bg-secondary dark:bg-secondary`}
    >
      <div>
        <Link
          href={'/admin'}
          className="flex items-center p-4 space-x-2 transition-all "
        >
          {open ? theme === 'dark' ? <LogoLight /> : <Logo /> : <ZeLogo />}
          <span
            className={`text-xl leading-none duration-300 ${!open && 'hidden'}`}
          >
            Admin
          </span>
        </Link>
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            return (
              <Tooltip key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-center p-2 space-x-3 text-xl rounded-md jusr hover:bg-secondary-foreground hover:text-secondary"
                >
                  <TooltipTrigger>{item.icon}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    sideOffset={10}
                    className={`${open && 'hidden'}`}
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                  <span
                    className={`flex-1 text-base leading-none font-medium duration-200 ${
                      !open && 'hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </Tooltip>
            )
          })}
        </div>
      </div>
      <div className="self-end">
        <Button variant={'ghost'} onClick={() => setOpen(!open)}>
          {open ? <RiMenuFoldFill size={24} /> : <RiMenuUnfoldFill size={24} />}
        </Button>
      </div>
    </nav>
  )
}

export default AdminNav
