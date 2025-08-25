import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for staff members
const mockStaff = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 890",
    role: "Teacher",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+44 789 456 123",
    role: "Campus Admin",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Mark Johnson",
    email: "mark.johnson@email.com",
    phone: "+880 1234 567890",
    role: "Verifier",
    status: "Active",
  },
]

export default function StaffPage() {
  const [staffList] = useState(mockStaff)

  const getStatusBadge = (status: string) => {
    return status === "Active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Inactive
      </Badge>
    )
  }

  return (
    <div className="text-xs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Staff Management</CardTitle>
            <CardDescription className="text-xs">
              Manage staff details, roles, and status
            </CardDescription>
          </div>
          <Link to="add">
            <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Phone</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium text-xs">{staff.name}</TableCell>
                  <TableCell className="text-xs">{staff.email}</TableCell>
                  <TableCell className="text-xs">{staff.phone}</TableCell>
                  <TableCell className="text-xs">{staff.role}</TableCell>
                  <TableCell className="text-xs">{getStatusBadge(staff.status)}</TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Link to={`edit-staff/${staff.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center justify-end gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
