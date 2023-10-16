import User from '@/models/User';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';



import dbConnect from '@/lib/dbConnect'

const {
  MONGOODB_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  MODE,
} = process.env

const GIT_CLIENT_ID = MODE === 'dev' ? GITHUB_CLIENT_ID : GITHUB_CLIENT_ID
const GIT_CLIENT_SECRET =
  MODE === 'dev' ? GITHUB_CLIENT_SECRET : GITHUB_CLIENT_SECRET
const G_CLIENT_ID = MODE === 'dev' ? GOOGLE_CLIENT_ID : GOOGLE_CLIENT_ID
const G_CLIENT_SECRET =
  MODE === 'dev' ? GOOGLE_CLIENT_SECRET : GOOGLE_CLIENT_SECRET

export const providers = () => {
  const providers = [
    GoogleProvider({
      clientId: G_CLIENT_ID!,
      clientSecret: G_CLIENT_SECRET!,
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
      clientId: GIT_CLIENT_ID!,
      clientSecret: GIT_CLIENT_SECRET!,
      async profile(profile) {
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
        return {
          id: profile.id.toString(),
          ...userProfile,
        }
      },
    }),
  ]

  return providers
}