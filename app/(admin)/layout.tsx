import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UnAuth from '@/components/shared/UnAuth'
import { getUser } from '@/lib/auth'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser(headers)

  if (!user) {
    return <UnAuth />
  }

  if (!user.active) redirect('/deactive')
  return <AdminPanelLayout>{children}</AdminPanelLayout>
}

export const dynamic = 'force-dynamic'
