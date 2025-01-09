import { Loader } from 'lucide-react'

const PageLoder = () => {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 ">
        <h1 className="text-5xl font-bold">GCO</h1>
        <Loader className="animate-spin size-9" />
      </div>
    </div>
  )
}

export default PageLoder
