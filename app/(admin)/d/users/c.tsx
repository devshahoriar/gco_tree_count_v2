/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PERMISSIONS, USERROLES } from '@/data/const'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { updateUser } from './action'

export const EditUser = ({ user }: { user: any }) => {
  const [permissions, setPermissions] = useState<string[]>(
    user.permissions ? user.permissions.split(',').filter(Boolean) : []
  )
  const [role, setRole] = useState<string>(user.role)
  const [active, setActive] = useState<boolean>(user.active)
  const [loading, setLoading] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { refresh } = useRouter()
  const { data } = useSession()
  const currentUserRole = data?.user?.role
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await updateUser(user.id, { permissions, role, active })

      if (result.success) {
        toast.success('User updated successfully')
        closeRef.current?.click()
        refresh()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to update user')
    }
    setLoading(false)
  }

  const togglePermission = (permission: string) => {
    setPermissions((current) =>
      current.includes(permission)
        ? current.filter((p) => p !== permission)
        : [...current, permission]
    )
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Edit</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Update user</CredenzaTitle>
          <CredenzaDescription>
            Edit for {user.name || user.email}
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <div className="text-sm text-muted-foreground">
                  {active ? 'User is active' : 'User is inactive'}
                </div>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
            {currentUserRole === USERROLES.SUPERADMIN && (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(USERROLES).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid gap-4">
                {Object.keys(PERMISSIONS).map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission}
                      checked={permissions.includes(permission)}
                      onCheckedChange={() => togglePermission(permission)}
                    />
                    <Label htmlFor={permission}>
                      {permission.split('_').join(' ').toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
          <CredenzaClose asChild>
            <Button ref={closeRef} variant="outline">
              Cancel
            </Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}
