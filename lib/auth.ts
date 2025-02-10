import prisma from '@/prisma/db'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { headers } from 'next/headers'
import { getSession } from './auth-client'
// import logger from './logger'
import { APP_URL } from '@/data/const'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'mysql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: [APP_URL],
  baseURL: APP_URL,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24 * 2,
    additionalFields: {
      createdAt: {
        type: 'date',
        returned: false,
      },
      updatedAt: {
        type: 'date',
        returned: false,
      },
      userAgent: {
        type: 'string',
        returned: false,
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        name: 'token',
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        default: 'user',
        required: false,
      },
      permissions: {
        type: 'string',
        default: '',
        required: false,
      },
      active: {
        type: 'boolean',
        required: false,
        returned: true,
      },
      createdAt: {
        type: 'date',
        returned: false,
        required: false,
      },
      updatedAt: {
        type: 'date',
        returned: false,
        required: false,
      },
      emailVerified: {
        type: 'boolean',
        returned: false,
        required: false,
      },
    },
  },
})

export const getUser = async (header: typeof headers) => {
  const { data } = await getSession({
    fetchOptions: {
      headers: await header(),
    },
  })
  const user = data?.user
  return user
}
