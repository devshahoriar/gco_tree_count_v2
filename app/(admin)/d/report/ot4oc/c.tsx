'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import InputBox from "@/components/shared/InputBox"

interface FormData {
  reportType: string
  fileType: 'pdf' | 'excl'
  startDate: string
  endDate: string
  withImage: string
  division: string
  zilla: string
  upzilla: string
  union: string
  wordNo: string
}

export const PrintControl = () => {
  const [formData, setFormData] = useState<FormData>({
      reportType: '',
      fileType: 'pdf',
      startDate: '',
      endDate: '',
      withImage: '',
      division: '',
      zilla: '',
      upzilla: '',
      union: '',
      wordNo: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
  
    const handleChange = (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  
    const handleSubmit = async () => {
      setLoading(true)
      try {
        // Handle submission logic here
      } catch (err) {
        console.log(err)
        setError('Something went wrong')
      } finally {
        setLoading(false)
      }
    }
  
  return (
    <div className="flex justify-center items-center print:hidden">
      <Card className="w-full sm:w-[500px]">
        <CardHeader>
          <CardTitle className="text-4xl text-center">Report</CardTitle>
          <CardDescription className="text-center">Make your report</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col items-center gap-3">
            <select
              value={formData.reportType}
              onChange={(e) => handleChange('reportType', e.target.value)} 
              className='from-input max-w-[180px] w-full rounded-md bg-transparent'
            >
              <option value="">Select Report</option>
              <option value="master">Master Roll</option>
              <option value="reg">Registration</option>
            </select>

            <div className="flex items-center gap-3">
              <span>PDF</span>
              <Switch
                checked={formData.fileType === 'excl'}
                onCheckedChange={(checked) =>
                  handleChange('fileType', checked ? 'excl' : 'pdf')
                }
              />
              <span>EXCL</span>
            </div>

            <InputBox
              id="startDate"
              title="Start date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full max-w-[180px]"
            />

            <InputBox
              id="endDate"
              title="End date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full max-w-[180px]"
            />

            <p className="text-red-600 text-center h-5">{error}</p>

            <div className="flex justify-center gap-2">
              <Button
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Loading...' : 'Make Report'}
              </Button>
              <Button
                onClick={() =>
                  setFormData({
                    reportType: '',
                    fileType: 'pdf',
                    startDate: '',
                    endDate: '',
                    withImage: '',
                    division: '',
                    zilla: '',
                    upzilla: '',
                    union: '',
                    wordNo: '',
                  })
                }
                variant='outline'
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

