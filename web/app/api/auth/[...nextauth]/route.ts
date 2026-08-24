import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,  // ← allows any host (tunnels, proxies, custom domains)

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null

        return {
          id:        user.id,
          email:     user.email,
          name:      `${user.firstName} ${user.lastName}`,
          image:     user.avatar,
          role:      user.role,
          plan:      user.membershipPlan,
          isStudent: user.isStudent,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id        = user.id
        token.role      = (user as any).role
        token.plan      = (user as any).plan
        token.isStudent = (user as any).isStudent
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id        = token.id
        ;(session.user as any).role     = token.role
        ;(session.user as any).plan     = token.plan
        ;(session.user as any).isStudent = token.isStudent
      }
      return session
    },
  },

  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },
})

export { handler as GET, handler as POST }
