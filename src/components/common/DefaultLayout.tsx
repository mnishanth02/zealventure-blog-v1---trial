import { FC } from 'react'

import UserNav from './UserNav'

interface DefaultLayoutProps {
  children: React.ReactNode
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <section>
      <UserNav />
      {children}
    </section>
  )
}

export default DefaultLayout
