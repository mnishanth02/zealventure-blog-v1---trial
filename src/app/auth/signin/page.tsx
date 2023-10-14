'use client'

import { FC } from 'react'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'

interface SignInPageProps {}

const SignInPage: FC<SignInPageProps> = ({}) => {
  return (
    <section>
      <div className="flex items-center justify-center h-screen">
        <Button onClick={async () => await signIn()}>Login</Button>
      </div>
    </section>
  )
}

export default SignInPage
