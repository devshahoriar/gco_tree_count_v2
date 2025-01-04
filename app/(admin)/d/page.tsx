import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function Page() {
  const user = await getUser(headers)
  console.log(user)
  return (
    <ContentLayout title="Dashboard">
      <div>Test</div>
    </ContentLayout>
  )
}
