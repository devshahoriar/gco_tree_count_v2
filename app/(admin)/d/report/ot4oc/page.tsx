/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { PrintControl } from './c'
import { allDivision } from '../../ot4oc/new/action'

const ReportOt4oc =async () => {
  // const allDisi = await allDivision()
  return (
    <ContentLayout title="OT4OC Report">
      <div className='flex justify-center items-center h-96'>
        <h1>Don't have data</h1>
      </div>
      {/* <PrintControl allDisi={allDisi} /> */}
    </ContentLayout>
  )
}

export default ReportOt4oc
