import { ContentLayout } from '@/components/admin-panel/content-layout'
import NoAccessPermissionPage from '@/components/shared/NoAccessPermission'
import { PERMISSIONS } from '@/data/const'
import { getUser } from '@/lib/auth'
import { getUserPermissions } from '@/lib/auth-client'
import { headers } from 'next/headers'
import { ReactNode } from 'react'

const OT4OCLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUser(headers)
  const permissions = getUserPermissions(user)

  if (!permissions.includes(PERMISSIONS.OT4OC)) {
    return (
      <ContentLayout title="Do not have permission">
        <NoAccessPermissionPage />
      </ContentLayout>
    )
  }
  return <>{children}</>
}

export default OT4OCLayout
