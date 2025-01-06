import { ContentLayout } from '@/components/admin-panel/content-layout'
import { notFound } from 'next/navigation'
import { getAllTreeTypes, getOt4ocById, getTreesByOt4ocId } from './action'
import EditTree from './EditTree'

const AddImagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = await (await params).id
  if (!id) {
    return notFound()
  }
  const alltrees = await getAllTreeTypes()
  const babyInfo = await getOt4ocById(id)
  const foundTrees = await getTreesByOt4ocId(id)

  const previousLyAddedTress = babyInfo?.tree_count || 0
  const foundTressCount = foundTrees?.length

  const newTreeCount = previousLyAddedTress - foundTressCount

  return (
    <ContentLayout title="Add Image">
      <div>
        <p className="font-light">Add tree image for</p>
        <h1 className="text-3xl">Name: {babyInfo?.childName}</h1>
        <p>Father Name: {babyInfo?.fatherName}</p>
        <div className="text-sm">
          <p>Phone: {babyInfo?.phone}</p>
          <p>
            ID: {babyInfo?.id} - {babyInfo?.masterId}
          </p>
          <p>Total tree : {babyInfo?.tree_count}</p>
        </div>
      </div>
      <div className="grid grid-cols-1  gap-5 mt-5 md:grid-cols-2 xl:grid-cols-3 place-items-start">
        {foundTrees.map((tree, i) => (
          <EditTree ot4ocId={id} key={i} allTress={alltrees} tree={tree} />
        ))}
        {new Array(newTreeCount).fill('_').map((n, i) => (
          <EditTree ot4ocId={id} key={i} allTress={alltrees} />
        ))}
      </div>
    </ContentLayout>
  )
}

export default AddImagePage
