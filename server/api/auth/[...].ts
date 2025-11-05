import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import AppleProvider from 'next-auth/providers/apple'
import AzureADProvider from 'next-auth/providers/azure-ad'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '~/server/utils/prisma'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  adapter: PrismaAdapter(prisma),
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    }),
    // @ts-expect-error
    GitHubProvider.default({
      clientId: useRuntimeConfig().githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
    }),
    // @ts-expect-error
    AppleProvider.default({
      clientId: useRuntimeConfig().appleClientId,
      clientSecret: useRuntimeConfig().appleClientSecret,
    }),
    // @ts-expect-error
    AzureADProvider.default({
      clientId: useRuntimeConfig().microsoftClientId,
      clientSecret: useRuntimeConfig().microsoftClientSecret,
      tenantId: 'common', // Allows personal Microsoft accounts
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // @ts-ignore
        session.user.role = user.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
})
