import { ContentLayout } from '@/components/admin-panel/content-layout'
import NewOt4oc from './NewOt4oc'
import { allDivision } from './action'

const Ot4OcnewPage = async () => {
  const allDisi = await allDivision()

  return (
    <ContentLayout title="New OT4OC">
      <NewOt4oc allDivi = {allDisi} />
    </ContentLayout>
  )
}

export default Ot4OcnewPage
