import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

const middleware = async (req: NextRequest) => {
  NextResponse.rewrite(new URL(req.url))
}

export default withAuth(middleware, {
  callbacks: {
    authorized({ token }) {
      return token?.role === 'admin'
    },
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
