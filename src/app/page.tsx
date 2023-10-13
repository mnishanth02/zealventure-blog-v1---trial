import Image from 'next/image'

import UserNav from '@/components/common/UserNav'

export default function Home() {
  return (
    <section className="">
      <UserNav />
      <div>Home page</div>
    </section>
  )
}
