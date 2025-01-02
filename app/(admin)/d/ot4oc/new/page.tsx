import { ContentLayout } from '@/components/admin-panel/content-layout'
import NewOt4oc from './NewOt4oc'
import { allDivision } from './action'
import prisma from '@/prisma/db'

const Ot4OcnewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) => {
  const allDisi = await allDivision()
  const id = (await searchParams).id
  let upOt4oc = null
  if (id) {
    upOt4oc = await prisma.ot4oc.findUnique({
      where: {
        id: Number(id),
      },
    })
  }

  return (
    <ContentLayout title="New OT4OC">
      <NewOt4oc allDivi={allDisi} upOt4oc={upOt4oc} />
    </ContentLayout>
  )
}

export default Ot4OcnewPage
