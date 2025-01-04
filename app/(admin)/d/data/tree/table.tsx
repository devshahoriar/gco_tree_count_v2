'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TreeType } from "@/output"
import { EditTreeDialog } from './c'

export const TreeTable = ({ trees }: { trees: TreeType[] }) => {


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trees.map((tree) => (
          <TableRow key={tree.id}>
            <TableCell>{tree.id}</TableCell>
            <TableCell>{tree.name}</TableCell>
            <TableCell>
              <EditTreeDialog tree={tree} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
