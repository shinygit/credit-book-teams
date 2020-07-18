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
  /*   callbacks: {
    session: async (session, token) => {
      const userId = await prisma.sessions.findOne({
        where: { access_token: session.accessToken },
      })
      session.userId = userId.user_id
      return session
    },
  }, */
  /*   database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST_NEXT_AUTH,
    port: process.env.DATABASE_PORT_NEXT_AUTH,
    username: process.env.DATABASE_USERNAME_NEXT_AUTH,
    password: process.env.DATABASE_PASSWORD_NEXT_AUTH,
    database: process.env.DATABASE_DATABASE_NEXT_AUTH,
  } */
  secret: process.env.SECRET,
}

export default (req, res) => NextAuth(req, res, options)
