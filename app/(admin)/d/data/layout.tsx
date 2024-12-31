import { ContentLayout } from '@/components/admin-panel/content-layout'
import NoAccessPermissionPage from '@/components/shared/NoAccessPermission'
import { PERMISSIONS } from '@/data/const'
import { getUser } from '@/lib/auth'
import { getUserPermissions } from '@/lib/auth-client'
import { headers } from 'next/headers'
import { ReactNode } from 'react'

const DataLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getUser(headers)
  const permissions = getUserPermissions(user)

  if (!permissions.includes(PERMISSIONS.DATA)) {
    return (
      <ContentLayout title="Do not have permission">
        <NoAccessPermissionPage />
      </ContentLayout>
    )
  }
  return <>{children}</>
}

export default DataLayout
