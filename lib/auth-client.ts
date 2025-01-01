/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAuthClient } from 'better-auth/react'

import { inferAdditionalFields } from 'better-auth/client/plugins'
import { auth } from './auth'

export const { signIn, signUp, useSession, getSession, signOut } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_URL!,
    plugins: [inferAdditionalFields<typeof auth>()],
  })

export const getUserPermissions = (data: any): [string] | [] => {
  const p = data?.user?.permissions || data?.permissions
  if (!p) return []
  return p.split(',')
}
