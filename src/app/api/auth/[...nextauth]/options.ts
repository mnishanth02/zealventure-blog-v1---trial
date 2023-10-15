import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import { getServerSession, type NextAuthOptions } from 'next-auth'

import dbConnect from '@/lib/dbConnect'

import { providers } from './providers'

export const options: NextAuthOptions = {
  providers: providers(),
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role

      return token
    },
    async session({ session }) {
      await dbConnect()
      const user = await User.findOne({ email: session.user?.email })

      if (user)
        session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
        } as any
      return session
    },
  },

  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/404',
  // },
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, options)
}
