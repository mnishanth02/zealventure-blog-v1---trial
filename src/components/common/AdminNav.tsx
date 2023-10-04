'use client'
import { FC, useState } from 'react'
import Logo from './Logo'
import Link from 'next/link'

import { Button } from '../ui/button'

import { LuLayoutDashboard, LuMails, LuUsers } from 'react-icons/lu'
import { MdOutlineArticle, MdOutlineContactMail } from 'react-icons/md'

import { RiMenuFoldFill, RiMenuUnfoldFill } from 'react-icons/ri'
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
  {
    href: '/admin/contacts',
    icon: <MdOutlineContactMail />,
    label: 'Contacts',
  },
]

const AdminNav: FC<AdminNavProps> = ({}) => {
  const [open, setOpen] = useState(true)

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
          {open ? <Logo /> : <ZeLogo />}
          <span
            className={`text-xl leading-none duration-300 ${!open && 'hidden'}`}
          >
            Admin
          </span>
        </Link>
        <div className="p-4 space-y-2">
          {navItems.map(item => {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center p-2 space-x-3 text-xl rounded-md hover:bg-secondary-foreground hover:text-secondary"
              >
                {item.icon}
                <span
                  className={`flex-1 text-base leading-none font-medium duration-200 ${
                    !open && 'hidden'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      <Button
        variant={'ghost'}
        className="self-end"
        onClick={() => setOpen(!open)}
      >
        {open ? <RiMenuFoldFill size={24} /> : <RiMenuUnfoldFill size={24} />}
      </Button>
    </nav>
  )
}

export default AdminNav
