import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// Mock agent data
const mockagent = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    company: "Oxford University",
    addedOn: "2024-08-01",
    totalStudents: 120,
    status: "Active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@email.com",
    company: "Cambridge University",
    addedOn: "2024-06-15",
    totalStudents: 75,
    status: "Inactive",
  },
  {
    id: 3,
    firstName: "Mark",
    lastName: "Johnson",
    email: "mark.johnson@email.com",
    company: "MIT",
    addedOn: "2024-07-20",
    totalStudents: 200,
    status: "Active",
  },
]

export default function AgentPage() {
  const [agentList] = useState(mockagent)

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
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Agent Management</CardTitle>
            <CardDescription className="text-xs">
              Manage agent details, company, students, and status
            </CardDescription>
          </div>
          <Link to="add">
            <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
              <Plus className="h-4 w-4" />
              Add Agent
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">First Name</TableHead>
                <TableHead className="text-xs">Last Name</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Company</TableHead>
                <TableHead className="text-xs">Added On</TableHead>
                <TableHead className="text-xs">Total Students</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {agentList.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium text-xs">{agent.firstName}</TableCell>
                  <TableCell className="text-xs">{agent.lastName}</TableCell>
                  <TableCell className="text-xs">{agent.email}</TableCell>
                  <TableCell className="text-xs">{agent.company}</TableCell>
                  <TableCell className="text-xs">{new Date(agent.addedOn).toLocaleDateString()}</TableCell>
                  <TableCell className="text-xs">{agent.totalStudents}</TableCell>
                  <TableCell className="text-xs">{getStatusBadge(agent.status)}</TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Link to={`edit-agent/${agent.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
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
