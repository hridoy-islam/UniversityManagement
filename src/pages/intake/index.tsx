import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for intakes
const mockIntakes = [
  {
    id: 1,
    name: "Spring 2024 Intake",
    validTill: "2024-03-15",
    campus: "Watney College, Nelson Street",
    courses: [
      "Entry Level Certificate in ESOL International All Modes (Entry 3)",
      "Focus Awards Level 3 Diploma in Business Administration",
    ],
    status: "Active",
  },
  {
    id: 2,
    name: "Summer 2024 Intake",
    validTill: "2024-06-30",
    campus: "Downtown Campus",
    courses: ["ESB Level 2 Certificate in ESOL Skills for Life", "Level 2 Adult Social Care Certificate"],
    status: "Active",
  },
  {
    id: 3,
    name: "Fall 2024 Intake",
    validTill: "2024-09-15",
    campus: "Watney College, Nelson Street",
    courses: ["Level 4 Diploma in Adult Care"],
    status: "Inactive",
  },
]

export default function IntakePage() {
  const [intakes] = useState(mockIntakes)

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
            <CardTitle className="text-2xl font-bold">Intake Management</CardTitle>
            <CardDescription className="text-xs">
              Manage your educational intakes, courses, and campus assignments
            </CardDescription>
          </div>
          <Link to="add">
            <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
              <Plus className="h-4 w-4" />
              Add Intake
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Intake Name</TableHead>
                <TableHead className="text-xs">Valid Till</TableHead>
                <TableHead className="text-xs">Campus</TableHead>
                <TableHead className="text-xs">Courses</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {intakes.map((intake) => (
                <TableRow key={intake.id}>
                  <TableCell className="font-medium text-xs">{intake.name}</TableCell>
                  <TableCell className="text-xs">{new Date(intake.validTill).toLocaleDateString()}</TableCell>
                  <TableCell className="text-xs">{intake.campus}</TableCell>
                  <TableCell className="text-xs">
    
                        {intake.courses.length} 
                     
                     
                    
                  </TableCell>
                  <TableCell className="text-xs">{getStatusBadge(intake.status)}</TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Link to={`edit-intake/${intake.id}`}>
                      <Button variant="default" size="sm" className="flex items-center justify-end gap-2 bg-theme text-white hover:bg-theme/90 text-xs">
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
