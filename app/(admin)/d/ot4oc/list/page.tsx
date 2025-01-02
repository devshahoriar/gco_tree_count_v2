import { ContentLayout } from '@/components/admin-panel/content-layout'
import { countOt4oc, getListOfOt4oc } from './action'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Filter from './Filter'
import Link from 'next/link'

const Ot4ocNewPage = async () => {
  const list = await getListOfOt4oc({ page: '1' })
  const count = await countOt4oc()
  return (
    <ContentLayout title={` OT4OC`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="">Total: {count}</p>
        </div>
        <div className='flex items-center gap-2'>
          <Filter />
          <Button>
            <span className='hidden md:inline'>Reset</span>
            <X />
          </Button>
        </div>
      </div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Master ID</TableHead>
            <TableHead>Child Name</TableHead>
            <TableHead>Father Name</TableHead>
            <TableHead>Village</TableHead>
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
              <TableCell>{item.childName || '-'}</TableCell>
              <TableCell>{item.fatherName || '-'}</TableCell>
              <TableCell>{item.village || '-'}</TableCell>
              <TableCell>{item.phone || '-'}</TableCell>
              <TableCell>{item.tree_count || 0}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link 
                  href={`/d/ot4oc/new?id=${item.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Update
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  )
}

export default Ot4ocNewPage
