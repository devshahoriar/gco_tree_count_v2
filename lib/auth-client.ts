/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAuthClient } from 'better-auth/react'

import { inferAdditionalFields } from 'better-auth/client/plugins'
import { auth } from './auth'
import { APP_URL, PERMISSIONS } from '@/data/const'

export const { signIn, signUp, useSession, getSession, signOut } =
  createAuthClient({
    baseURL: APP_URL!,
    plugins: [inferAdditionalFields<typeof auth>()],
  })

export const getUserPermissions = (data: any): string[] => {
  const p = data?.user?.permissions || data?.permissions
  if (!p) return []
  return p.split(',')
}

export const haveUserPermission = (data: any, permission: keyof typeof PERMISSIONS | string) => {
  const userPermissions = getUserPermissions(data)
  return userPermissions.includes(permission)
}
