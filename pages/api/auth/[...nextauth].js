import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '../../../prisma/prisma'
const options = {
  site: process.env.NEXTAUTH_URL,
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  // A database is optional, but required to persist accounts in a database
  callbacks: {
    session: async (session) => {
      const userId = await prisma.session.findOne({
        where: { accessToken: session.accessToken },
      })
      session.userId = userId.userId
      return session
    },
  },

  secret: process.env.SECRET,
}

export default (req, res) => NextAuth(req, res, options)
