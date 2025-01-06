/* eslint-disable @next/next/no-img-element */
'use client'
import { InputParent } from '@/components/shared/InputBox'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Tree_Type, updateTree } from './action'
import AddImage from './AddImage'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const EditTree = ({
  ot4ocId,
  tree,
  allTress,
}: {
  ot4ocId: number | string
  allTress: { id: number; name: string }[]
  tree?: Tree_Type
}) => {
  const [addedImage, setAddedImage] = useState<File[]>([])
  const [location, setLoaction] = useState<{
    lat: number
    lon: number
  }>()
  const [error, setError] = useState('')
  const isUpdated = Boolean(tree?.id)
  const [isPending, trens] = useTransition()
  const [selectTree, setSelectTree] = useState<number>()
  const { refresh } = useRouter()

  const hendelAdd = async () => {
    setError('')
    if (addedImage.length === 0) {
      setError('Please add a image')
      return
    }
    if (!location) {
      setError('Please select location')
      return
    }
    if (!tree?.treeType.id && !selectTree) {
      setError('Please select tree')
      return
    }

    trens(async () => {
      const d = await updateTree({
        imgs: addedImage,
        location,
        ot4ocId: Number(ot4ocId),
        treeTypeId: selectTree || tree?.treeType?.id,
        treeId: tree?.id,
        update: isUpdated,
      })
      if (d?.error) {
        setError(d.error)
      }
      if (d?.success) {
        refresh()
        toast.success('Image added successfully')
      }
    })
  }
  return (
    <Card className="drop-shadow-md w-full">
      <CardHeader>
        <CardTitle>Add or remove images</CardTitle>
        <CardDescription>Add Image for {ot4ocId} ID.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <InputParent>
            <Label>Select Tree</Label>
            <select
              value={selectTree}
              onChange={(e) => setSelectTree(Number(e.target.value))}
              defaultValue={isUpdated ? tree?.treeType.id : undefined}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>select</option>
              {allTress?.map((t, i) => (
                <option key={i} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </InputParent>
          <div>
            <AddImage
              addFun={setAddedImage}
              setLoaction={setLoaction}
              location={location}
            />
            {addedImage.length > 0 && (
              <div className="mt-2">
                <Label>Selected Images</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {addedImage?.map((img, i) => (
                    <div className="relative" key={i}>
                      <button
                        className="absolute rounded top-[1px] right-[1px] z-10 bg-red-600 p-[1px] bg-opacity-80"
                        onClick={() =>
                          setAddedImage((p) =>
                            p.filter((_, index) => index !== i)
                          )
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                      <img
                        src={URL.createObjectURL(img)}
                        alt="tree"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {location && (
            <div>
              <Label>Location</Label>
              <div className="flex gap-2 text-xs">
                <p>Lat: {location.lat.toFixed(2)}</p>
                <p>Lon: {location.lon.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-3">
        <Button disabled={isPending} onClick={hendelAdd}>
          Save
        </Button>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      </CardFooter>
    </Card>
  )
}

export default EditTree
