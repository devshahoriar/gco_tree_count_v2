/* eslint-disable react/no-unescaped-entities */
'use client'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation' 
import { Button } from '../ui/button'

const NoAccessPermissionPage = () => {
  const router = useRouter()

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-24 h-24 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold  mb-4">
          Access Denied
        </h1>
        <p className="text-gray-400 mb-8">
          Sorry, you don't have permission to access this page. Please contact your administrator for more information.
        </p>
        <Button
          onClick={() => router.back()}
          variant='outline'
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default NoAccessPermissionPage