/* eslint-disable react/no-unescaped-entities */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { getAllTree } from './action'
import { AddNewTree } from './c'

const AddTreePage = async () => {
  const trees = await getAllTree()
  return (
    <ContentLayout title="Add Tree">
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
    </ContentLayout>
  )
}

export default AddTreePage
