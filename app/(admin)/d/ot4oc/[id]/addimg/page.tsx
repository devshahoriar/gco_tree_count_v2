import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RefreshButton } from '../../list/Filter'
import {
  getAllTreeTypes,
  getLocationById,
  getOt4ocById,
  getTreesByOt4ocId,
  getTreesByOt4ocIdReplaced,
} from './action'
import EditTree from './EditTree'

const AddImagePage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const id = (await params).id
  if (!id) {
    return notFound()
  }

  const locations = await getLocationById(id)

  if (
    !locations ||
    !locations.division ||
    !locations.zilla ||
    !locations.upZilla ||
    !locations.union ||
    !locations.wordNo
  ) {
    return (
      <ContentLayout title='Add Image'>
        <div className='flex justify-between items-center'>
          <div>
            <p className='font-light'>Add tree image for</p>
            <h1 className='text-3xl'>Name: </h1>
            <p>Father Name: </p>
            <div className='text-sm'>
              <p>Phone: </p>
              <p>ID: -</p>
              <p>Total tree : </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <RefreshButton />
            <Button asChild>
              <Link href={`/d/ot4oc/new?id=${id}`}>Edit</Link>
            </Button>
            <Button asChild>
              <Link href={`/d/ot4oc/view?id=${id}`}>View</Link>
            </Button>
          </div>
        </div>
        <div className='mt-[25vh]'>
          <p className='text-red-500 text-4xl font-medium text-center'>
            First select word no, union, up-zilla, zilla, division.
          </p>
        </div>
      </ContentLayout>
    )
  }

  const alltrees = await getAllTreeTypes()
  const babyInfo = await getOt4ocById(id)
  const foundTrees = await getTreesByOt4ocId(id)
  const replacedTrees = await getTreesByOt4ocIdReplaced(id)

  const previousLyAddedTress = babyInfo?.tree_count || 0
  const foundTressCount = foundTrees?.length

  const replacedTressCountInitial = babyInfo?.replaceTreeCount || 0
  const replacedTressCount = replacedTrees?.length || 0

  const replacedTressCountFinal =
    replacedTressCountInitial - replacedTressCount > 0
      ? replacedTressCountInitial - replacedTressCount
      : 0

  const newTreeCount =
    previousLyAddedTress - foundTressCount > 0
      ? previousLyAddedTress - foundTressCount
      : 0

  return (
    <ContentLayout title='Add Image'>
      {/* this is uppar info  */}
      <div className='flex justify-between items-center'>
        <div>
          <p className='font-light'>Add tree image for</p>
          <h1 className='text-3xl'>Name: {babyInfo?.childName}</h1>
          <p>Father Name: {babyInfo?.fatherName}</p>
          <div className='text-sm'>
            <p>Phone: {babyInfo?.phone}</p>
            <p>
              ID: {babyInfo?.id} - {babyInfo?.masterId}
            </p>
            <p>Total tree : {babyInfo?.tree_count}</p>
          </div>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row'>
          <RefreshButton />
          <Button asChild>
            <Link href={`/d/ot4oc/new?id=${id}`}>Edit</Link>
          </Button>
          <Button asChild>
            <Link href={`/d/ot4oc/view?id=${id}`}>View</Link>
          </Button>
        </div>
      </div>

      {/* here the logic begin  */}
      <div>
        <h1 className='mt-5 text-2xl font-semibold w-full border-b border-zinc-500 mb-2 pb-1'>
          Initial Trees
        </h1>
        <div className='grid grid-cols-1  gap-5 mt-1 md:grid-cols-2 xl:grid-cols-3 place-items-start'>
          {foundTrees.map((tree, i) => (
            <EditTree ot4ocId={id} key={i} allTress={alltrees} tree={tree} />
          ))}
          {new Array(Number(newTreeCount)).fill('_').map((n, i) => (
            <EditTree ot4ocId={id} key={i} allTress={alltrees} />
          ))}
        </div>
      </div>
      {replacedTressCountInitial > 0 && (
        <div>
          <h1 className='mt-5 text-2xl font-semibold w-full border-b border-zinc-500 mb-2 pb-1'>
            Replaced Trees
          </h1>
          <div className='grid grid-cols-1  gap-5 mt-1 md:grid-cols-2 xl:grid-cols-3 place-items-start'>
            {replacedTrees.map((tree, i) => (
              <EditTree
                ot4ocId={id}
                key={i}
                allTress={alltrees}
                tree={tree}
                thisIsReplacedTree={true}
              />
            ))}
            {new Array(Number(replacedTressCountFinal))
              .fill('_')
              .map((n, i) => (
                <EditTree
                  ot4ocId={id}
                  key={i}
                  allTress={alltrees}
                  thisIsReplacedTree={true}
                />
              ))}
          </div>
        </div>
    )} 
    </ContentLayout>
  )
}

export default AddImagePage
