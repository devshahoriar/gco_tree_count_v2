import { ContentLayout } from '@/components/admin-panel/content-layout'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditUser } from './c'
import { getAllUser } from './action'
import { getUser } from '@/lib/auth'
import { headers } from 'next/headers'
import { cn } from '@/lib/utils'
import { PERMISSIONS, USERROLES } from '@/data/const'
import { getUserPermissions } from '@/lib/auth-client'
import NoAccessPermissionPage from '@/components/shared/NoAccessPermission'

const ManageUsersPage = async () => {
  const users = await getAllUser()
  const currentUser = await getUser(headers)

  const permissions = getUserPermissions(currentUser)

  if (!permissions.includes(PERMISSIONS.OT4OC)) {
    return (
      <ContentLayout title="Do not have permission">
        <NoAccessPermissionPage />
      </ContentLayout>
    )
  }

  return (
    <ContentLayout title="Users">
      <div>
        <h2 className="font-bold">{users.length} Users.</h2>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SN</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <p>{user.name}</p>
                    {user.active ? (
                      <span className="text-green-500 text-xs">Active</span>
                    ) : (
                      <span className="text-red-500 text-xs">Inactive</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <span>Admin</span>
                  ) : (
                    <span className="text-red-600">Super Admin</span>
                  )}
                </TableCell>
                <TableCell>{user.permissions}</TableCell>
                <TableCell
                  className={cn(
                    'text-right',
                    user.role === USERROLES.SUPERADMIN &&
                      currentUser?.role === USERROLES.ADMIN &&
                      'opacity-50 pointer-events-none',
                    currentUser?.id === user.id &&
                      'opacity-50 pointer-events-none'
                  )}
                >
                  <EditUser user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default ManageUsersPage
