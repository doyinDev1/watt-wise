import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { verifyPassword, findUserByEmail } from "./auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await findUserByEmail(credentials.email)
        if (!user || !user.password) {
          return null
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password)
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: null,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Always update Google avatar in DB if signing in with Google
      if (account?.provider === 'google' && user.email) {
        type GoogleProfile = { picture?: string };
        const googleProfile = profile as GoogleProfile;
        if (googleProfile?.picture) {
          await db.user.update({
            where: { email: user.email },
            data: { image: googleProfile.picture }
          }).catch(() => {});
        }
        try {
          // Check if user already exists with this email (case-insensitive)
          const existingUser = await findUserByEmail(user.email.toLowerCase())
          
          if (existingUser) {
            // Link the Google account to existing user
            await db.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              update: {},
              create: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })
            // Update user object to use existing user ID
            user.id = existingUser.id
            return true
          }
        } catch (error) {
          console.error('Error linking accounts:', error)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) || token.sub || session.user.email || 'unknown'
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
}; 