import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PrintControl } from './c'
import { allDivision } from '../../ot4oc/new/action'

const ReportOt4oc =async () => {
  const allDisi = await allDivision()
  return (
    <ContentLayout title="OT4OC Report">
      <PrintControl allDisi={allDisi} />
    </ContentLayout>
  )
}

export default ReportOt4oc
