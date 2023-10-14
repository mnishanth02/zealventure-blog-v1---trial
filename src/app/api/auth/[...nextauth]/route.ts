import NextAuth from 'next-auth'

import { options } from './options'

const handler = NextAuth(options)

//  http://localhost:3000/api/auth/providers

export { handler as GET, handler as POST }
