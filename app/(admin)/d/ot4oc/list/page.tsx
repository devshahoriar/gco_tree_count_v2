import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'
import { Package } from 'lucide-react'
import Link from 'next/link'
import { countOt4oc, df, getListOfOt4oc } from './action'
import Filter, { RefreshButton, ResetButton } from './Filter'
import PaginationControl from './Pagination'

const Ot4ocNewPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string
    limit: string
    sortBy: string
    orderBy: string
    search: string
  }>
}) => {
  const sp = await searchParams
  const page = sp.page || df.page
  const limit = sp.limit || df.limit
  const sortBy = sp.sortBy || df.sortBy
  const orderBy = sp.orderBy || df.orderBy
  const search = sp.search || ''

  const list = await getListOfOt4oc({
    page: page,
    limit: limit,
    sortBy: sortBy,
    orderBy: orderBy,
    q: search,
  })
  const count = await countOt4oc()
  const hasNextPage = Number(limit) * Number(page) < count
  const totalPage = Math.ceil(count / Number(limit))

  return (
    <ContentLayout title={` OT4OC`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="">Total: {count}</p>
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <Filter />
         <ResetButton />
        </div>
      </div>
      {list.length > 0 ? (
        <Table className="mt-5 space-y-6">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Master ID</TableHead>
              <TableHead>Child Info</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Tree Count</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.masterId || '-'}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-lg">{item.childName || '-'}</p>{' '}
                    <p>{item.fatherName || '-'}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {item.village || '-'} {item?.union?.name} <br />
                    {item?.postOffice?.name} {item?.upZilla?.name} <br />
                    {item?.zilla?.name}
                  </div>
                </TableCell>

                <TableCell>{item.phone || '-'}</TableCell>
                <TableCell>{item.tree_count || 0}</TableCell>
                <TableCell>
                  {formatDate(item?.createdAt)}
                  <br />
                  by {item.User?.name || '-'}
                </TableCell>
                <TableCell className='flex flex-col gap-2 items-center justify-center md:flex-row'>
                  <Link
                    href={`/d/ot4oc/new?id=${item.id}`}
                    className="text-blue-600 hover:text-blue-800 text-center"
                  >
                    Update
                  </Link>
                  <Link
                    href={`/d/ot4oc/view?id=${item.id}`}
                    className="text-yellow-400 hover:text-yellow-800 text-center"
                  >
                    View
                  </Link>
                  <Link
                    href={`/d/ot4oc/${item.id}/addimg`}
                    className="text-green-400 hover:text-green-800 text-center"
                  >
                    Add Image
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 mt-10">
          <Package size={48} />
          <p className="mt-2">No item found</p>
          <Link 
          href={`/d/ot4oc/list`}
          className='text-black dark:text-white hover:opacity-70'
          >
           Show all
          </Link>
        </div>
      )}
      <div className="mt-3">
        <PaginationControl
          show = {search === ''}
          HasNext={hasNextPage}
          currentPage={page}
          totalPage={totalPage}
        />
      </div>
    </ContentLayout>
  )
}

export default Ot4ocNewPage
