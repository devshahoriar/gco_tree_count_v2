import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout'
import UnAuth from '@/components/shared/UnAuth'
import { getSession } from '@/lib/auth-client'
import { headers } from 'next/headers'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })
  if (data === null) {
    return <UnAuth />
  }
  return <AdminPanelLayout>{children}</AdminPanelLayout>
}
