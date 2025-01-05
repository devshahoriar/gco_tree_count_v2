/* eslint-disable react/no-unescaped-entities */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getAllTree } from './action'
import { AddNewTree } from './c'
import { TreeTable } from './table'
import { TreeType } from '@/prisma/out' 

const AddTreePage = async () => {
  const trees: TreeType[] = await getAllTree()
  return (
    <ContentLayout title="Add Tree">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold">{trees.length} Trees</p>
            <p className="text-xs text-red-600">
              Ones add you can't <b>delete</b> or <b>Remove</b>.
            </p>
            <p className="text-xs text-red-600"> Only you can edit.</p>
          </div>
          <AddNewTree />
        </div>
        <TreeTable trees={trees} />
      </div>
    </ContentLayout>
  )
}

export default AddTreePage
