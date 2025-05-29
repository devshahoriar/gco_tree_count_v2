/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
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
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { removeImage, Tree_Type, updateTree } from './action'
import AddImage from './AddImage'
import DeleteTree from './DeleteTree'

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
  const [cantTakeimg, setcantTakeimg] = useState(false)
  const [remark, setRemark] = useState('')
  const [isReplaced, setIsReplaced] = useState(false)
  const [replaceReason, setReplaceReason] = useState('')
  const [previousImg, setPreviousImg] = useState<
    {
      id: number
      url: string
      fileId: string | null
    }[]
  >([])
  const { refresh } = useRouter()

  useEffect(() => {
    if (tree?.images) {
      setPreviousImg(tree.images)
    }
    setIsReplaced(Boolean(tree?.replaced))
    setReplaceReason(tree?.replaceReason || '')
    if (tree?.remarkOfImg) {
      setRemark(tree.remarkOfImg)
      setcantTakeimg(true)
    }
    if (tree?.lat && tree?.lon) {
      setLoaction({ lat: Number(tree.lat), lon: Number(tree.lon) })
    }
  }, [tree])

  const handleAdd = async () => {
    setError('')

    if (!isReplaced) {
      if (!cantTakeimg) {
        if (addedImage.length === 0) {
          setError('Please add a image')
          return
        }
        if (!location) {
          setError('Please select location')
          return
        }
      } else {
        if (!remark) {
          setError('Please enter remark')
          return
        }
      }
    } else {
      if (!replaceReason) {
        setError('Please select reason')
        return
      }
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
        replaced: isReplaced,
        replaceReason,
        remark,
      })

      if (d?.error) {
        setError(d.error)
      }

      if (d?.success) {
        setAddedImage([])
        setLoaction(undefined)
        setRemark('')
        setSelectTree(undefined)
        setPreviousImg(d?.data || [])
        toast.success('Image added successfully')
      }
    })
  }

  const [preview, setPreview] = useState<any>()

  return (
    <>
      {/* this is for image preview  */}
      {preview && (
        <div className='fixed z-30 top-0 left-0 right-0 bottom-0 h-screen w-screen bg-black bg-opacity-10 flex items-center justify-center'>
          <div className='relative m-2'>
            <Button
              size='icon'
              className='absolute top-10 left-0'
              onClick={() => setPreview(undefined)}
            >
              <X size={20} />
            </Button>
            <img
              className='w-full h-full object-cover '
              src={preview}
              alt='ss'
            />
          </div>
        </div>
      )}

      <Card className='drop-shadow-md w-full relative'>
        {tree !== undefined && <DeleteTree id={tree.id} imgs={tree.images} />}

        <CardHeader>
          <CardTitle>Add or remove images</CardTitle>
          <CardDescription>
            Add Image for {ot4ocId} ID. tree id = {tree?.id}
            {tree?.thisForReplached && (
              <span className='text-red-600 bg-red-600 bg-opacity-20 rounded'>
                This tree is replaced.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <InputParent>
              <Label>Select Tree</Label>
              <select
                value={selectTree}
                onChange={(e) => setSelectTree(Number(e.target.value))}
                defaultValue={isUpdated ? tree?.treeType.id : undefined}
                className='from-input bg-transparent focus:outline-none rounded-md'
              >
                <option>select</option>
                {allTress?.map((t, i) => (
                  <option key={i} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </InputParent>

            {/* {!isReplaced && ( */}
              <>
                <div>
                  <div className='space-y-2'>
                    {previousImg?.length > 0 || (
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          checked={cantTakeimg}
                          id='cantTakeimg'
                          onCheckedChange={(v) => {
                            setcantTakeimg(v as boolean)
                            setAddedImage([])
                            setRemark('')
                            setLoaction(undefined)
                          }}
                        />
                        <Label htmlFor='cantTakeimg'>Can't take image.</Label>
                      </div>
                    )}
                    {cantTakeimg ? (
                      <div>
                        <Label>Enter Remark</Label>
                        <Input
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          placeholder="Why can't take image"
                        />
                      </div>
                    ) : (
                      <AddImage
                        addFun={setAddedImage}
                        setLoaction={setLoaction}
                        location={location}
                      />
                    )}
                  </div>

                  {addedImage.length > 0 && (
                    <div className='mt-2'>
                      <Label>Selected Images</Label>
                      <div className='flex gap-2 mt-1 flex-wrap'>
                        {addedImage?.map((img, i) => (
                          <div className='relative' key={i}>
                            <button
                              className='absolute rounded top-[1px] right-[1px] z-10 bg-red-600 p-[1px] bg-opacity-80'
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
                              onClick={() =>
                                setPreview(URL.createObjectURL(img))
                              }
                              alt='tree'
                              className='size-16 object-cover rounded-md'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {previousImg?.length > 0 && (
                    <div className='mt-2'>
                      <Label>Previous Images</Label>
                      <div className='flex gap-2 mt-1 flex-wrap'>
                        {previousImg?.map((img, i) => (
                          <div className='relative' key={i}>
                            <button
                              disabled={isPending}
                              onClick={async () => {
                                if (img?.fileId) {
                                  trens(async () => {
                                    await removeImage(
                                      tree?.id as any,
                                      img.fileId as any,
                                      img.id
                                    )
                                  })
                                  refresh()
                                }
                              }}
                              className='absolute rounded top-[1px] right-[1px] z-10 bg-red-600 p-[1px] bg-opacity-80 disabled:animate-pulse'
                            >
                              <Trash2 size={15} />
                            </button>
                            <img
                              src={img.url}
                              alt='tree'
                              className='size-16 object-cover rounded-md'
                              onClick={() => setPreview(img.url)}
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
                    <div className='flex gap-2 text-xs'>
                      <p>Lat: {location.lat.toFixed(2)}</p>
                      <p>Lon: {location.lon.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </>
            {/* )} */}

            {/* {previousImg?.length > 0 || ( */}
              <div className='flex-row flex items-center gap-2'>
                <Checkbox
                  id='replaced'
                  checked={isReplaced}
                  onCheckedChange={(v) => {
                    setIsReplaced(v as boolean)
                    setReplaceReason('')
                    setRemark('')
                    setAddedImage([])
                    // setLoaction(undefined)
                    setcantTakeimg(false)
                  }}
                />
                <Label htmlFor='replaced'>This tree replaced.</Label>
              </div>
            {/* )} */}
            {isReplaced && (
              <div>
                <Label>Replaced Reason</Label>
                <select
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className='from-input bg-transparent focus:outline-none rounded-md w-full'
                >
                  <option>select</option>\
                  <option value='Naturally died'>Naturally died</option>
                  <option value='Cutting'>Cutting</option>
                  <option value='Destroyed by animal'>
                    Destroyed by animal
                  </option>
                  <option value='Other'>Other</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex items-center gap-3'>
          <Button disabled={isPending} onClick={handleAdd}>
            Save
          </Button>
          {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
        </CardFooter>
      </Card>
    </>
  )
}

export default EditTree
