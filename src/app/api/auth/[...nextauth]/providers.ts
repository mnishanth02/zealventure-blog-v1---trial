import User from '@/models/User'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

import dbConnect from '@/lib/dbConnect'

export const providers = () => {
  const providers = [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await dbConnect()
        const oldUser = await User.findOne({ email: profile.email })

        const userProfile = {
          email: profile.email,
          name: profile?.name || profile.login,
          avatar: profile.picture,
          role: 'user',
        }
        if (!oldUser) {
          const newUser = new User({
            ...userProfile,
            provider: 'google',
          })
          await newUser.save()
        } else {
          userProfile.role = oldUser.role
        }

        return {
          id: profile.sub,
          ...userProfile,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile) {
        console.log(profile)

        await dbConnect()

        const oldUser = await User.findOne({ email: profile.email })

        const userProfile = {
          email: profile.email,
          name: profile?.name || profile.login,
          avatar: profile.avatar_url,
          role: 'user',
        }

        if (!oldUser) {
          const newUser = new User({
            ...userProfile,
            provider: 'github',
          })

          await newUser.save()
        } else {
          userProfile.role = oldUser.role
        }
        console.log({
          id: profile.id,
          ...userProfile,
        })

        return {
          id: profile.id.toString(),
          ...userProfile,
        }
      },
    }),
  ]

  return providers
}
