import { Metadata } from 'next'
import Link from 'next/link'
import { AiOutlineEdit } from 'react-icons/ai'

import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import AdminNav from '@/components/common/AdminNav'
import AdminSecondaryNav from '@/components/common/AdminSecondaryNav'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Zealventure - Admin',
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 p-4">
        <AdminSecondaryNav />
        {children}
      </div>
      <Link href={'/admin/posts/create'}>
        <Button
          size={'icon'}
          className="fixed z-10 rounded-full right-10 bottom-10"
        >
          <AiOutlineEdit size={20} />
        </Button>
      </Link>
    </div>
  )
}
