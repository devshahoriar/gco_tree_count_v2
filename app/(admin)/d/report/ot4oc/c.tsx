/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import InputBox, { InputParent } from '@/components/shared/InputBox'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import fetcher from '@/lib/swrFectcher'
import { Label } from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
import * as z from 'zod'

const formSchema = z.object({
  reportType: z.string().min(1, 'Report type is required'),
  fileType: z.enum(['pdf', 'excl']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  withImage: z.enum(['with', 'without']).default('without'),
  divisionId: z.string(),
  zillaId: z.string(),
  upZillaId: z.string(),
  unionId: z.string(),
  postId: z.string(),
  wordNo: z.string(),
})

type FormData = z.infer<typeof formSchema>

export const PrintControl = ({ allDisi }: any) => {
  const [formData, setFormData] = useState<FormData>({
    reportType: '',
    fileType: 'pdf',
    startDate: '',
    endDate: '',
    withImage: 'without', // Set default value
    divisionId: '',
    zillaId: '',
    upZillaId: '',
    unionId: '',
    postId: '',
    wordNo: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { data: zillas } = useSWR(
    () =>
      formData?.divisionId
        ? `/api/addData?divisionId=${formData.divisionId}`
        : null,
    fetcher
  )

  const { data: Upzillas } = useSWR(
    () =>
      formData?.zillaId ? `/api/addData?zillaId=${formData.zillaId}` : null,
    fetcher
  )

  const { data: unions } = useSWR(
    () =>
      formData?.upZillaId
        ? `/api/addData?upZillaId=${formData.upZillaId}`
        : null,
    fetcher
  )

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }

      if (field === 'divisionId') {
        newData.zillaId = ''
        newData.upZillaId = ''
        newData.unionId = ''
        newData.postId = ''
      } else if (field === 'zillaId') {
        newData.upZillaId = ''
        newData.unionId = ''
        newData.postId = ''
      } else if (field === 'upZillaId') {
        newData.unionId = ''
        newData.postId = ''
      }

      return newData
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const validatedData = formSchema.parse(formData)

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        body: JSON.stringify(validatedData),
        credentials: 'include',
      }).then((res) => res.json())

      if (response?.error) {
        setError(response.error)
        toast.error(response.error)
        return
      }

      toast.success('Report generated successfully')
      // Handle successful report generation (e.g. download or preview)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message || 'Validation failed'
        setError(errorMessage)
        toast.error(errorMessage)
      } else {
        setError('Failed to generate report')
        toast.error('Failed to generate report')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4 print:hidden">
      <Card className="w-full max-w-[600px] bg-gradient-to-br from-background to-secondary/10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-center">
            Generate Report
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Configure your report parameters below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-3">
            <div className="md:col-span-2 space-y-4">
              <select
                value={formData.reportType}
                onChange={(e) => handleChange('reportType', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Report Type</option>
                <option value="master">Master Roll</option>
                <option value="reg">Registration</option>
              </select>

              <div className="flex items-center justify-center gap-4 p-2 rounded-lg border border-input">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">PDF</span>
                  <Switch
                    checked={formData.fileType === 'excl'}
                    onCheckedChange={(checked) =>
                      handleChange('fileType', checked ? 'excl' : 'pdf')
                    }
                  />
                  <span className="text-sm font-medium">Excel</span>
                </div>{' '}
                |
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Without Image</span>
                  <Switch
                    checked={formData.withImage === 'with'}
                    onCheckedChange={(checked) =>
                      handleChange('withImage', checked ? 'with' : 'without')
                    }
                  />
                  <span className="text-sm font-medium">With Image</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <InputBox
                id="startDate"
                title="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <InputBox
                id="endDate"
                title="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Location selectors with consistent styling */}
            <InputParent>
              <Label className="text-sm font-medium">Division</Label>
              <select
                value={formData.divisionId}
                onChange={(e) => handleChange('divisionId', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Division</option>
                {allDisi.map((divi: any) => (
                  <option key={divi.id} value={divi.id}>
                    {divi.name}
                  </option>
                ))}
              </select>
            </InputParent>

            {zillas && (
              <InputParent>
                <Label className="text-sm font-medium">Zilla</Label>
                <select
                  value={formData.zillaId || ''}
                  onChange={(e) => handleChange('zillaId', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Zilla</option>
                  {zillas.map((zil: any) => (
                    <option key={zil.id} value={zil.id}>
                      {zil.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            )}

            {Upzillas && (
              <InputParent>
                <Label className="text-sm font-medium">Upazilla</Label>
                <select
                  value={formData.upZillaId || ''}
                  onChange={(e) => handleChange('upZillaId', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Upazilla</option>
                  {Upzillas.map((upz: any) => (
                    <option key={upz.id} value={upz.id}>
                      {upz.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            )}

            {unions && (
              <InputParent>
                <Label className="text-sm font-medium">Union</Label>
                <select
                  value={formData.unionId}
                  onChange={(e) => handleChange('unionId', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Union</option>
                  {unions?.unions?.map((uni: any) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            )}

            {unions && (
              <InputParent>
                <Label className="text-sm font-medium">Post Office</Label>
                <select
                  value={formData.postId}
                  onChange={(e) => handleChange('postId', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Post Office</option>
                  {unions?.posts?.map((post: any) => (
                    <option key={post.id} value={post.id}>
                      {post.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            )}
            {formData?.postId && (
              <InputParent>
                <Label className="text-sm font-medium">Word No</Label>
                <select
                  value={formData.wordNo}
                  onChange={(e) => handleChange('wordNo', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Word No</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num.toString()}>
                      {num}
                    </option>
                  ))}
                </select>
              </InputParent>
            )}

            {error && (
              <div className="md:col-span-2">
                <p className="text-destructive text-center text-sm">{error}</p>
              </div>
            )}

            <div className="md:col-span-2 flex justify-center gap-4">
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className="min-w-[120px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                    Processing...
                  </div>
                ) : (
                  'Generate Report'
                )}
              </Button>
              <Button
                onClick={() =>
                  setFormData({
                    reportType: '',
                    fileType: 'pdf',
                    startDate: '',
                    endDate: '',
                    withImage: 'without', // Reset to default
                    divisionId: '',
                    zillaId: '',
                    upZillaId: '',
                    unionId: '',
                    postId: '',
                    wordNo: '',
                  })
                }
                variant="outline"
                className="min-w-[120px]"
              >
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
