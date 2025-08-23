import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for courses
const mockCourses = [
  {
    id: 1,
    name: "Entry Level Certificate in ESOL International All Modes (Entry 3)",
    description: "Develops foundational English skills in reading, writing, speaking, and listening for non-native speakers.",
    campus: "Watney College, Nelson Street",
    sector: "Languages",
    owner: "Sarah Johnson",
    addedOn: "2023-11-15",
    status: "Active",
  },
  {
    id: 2,
    name: "Focus Awards Level 3 Diploma in Business Administration",
    description: "Comprehensive program covering business operations, management, and administration practices.",
    campus: "Downtown Campus",
    sector: "Business",
    owner: "Michael Chen",
    addedOn: "2023-10-22",
    status: "Active",
  },
  {
    id: 3,
    name: "Level 2 Adult Social Care Certificate",
    description: "Prepares learners for roles in adult care settings with focus on safeguarding, communication, and duty of care.",
    campus: "Watney College, Nelson Street",
    sector: "Health & Social Care",
    owner: "Emma Davis",
    addedOn: "2024-01-05",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Certificate in Digital Marketing",
    description: "Covers SEO, social media marketing, email campaigns, and analytics for modern marketers.",
    campus: "Downtown Campus",
    sector: "IT & Digital",
    owner: "Alex Turner",
    addedOn: "2023-12-10",
    status: "Active",
  },
  {
    id: 5,
    name: "Diploma in Early Childhood Education",
    description: "Trains educators in child development, curriculum planning, and inclusive learning environments.",
    campus: "North Campus",
    sector: "Education",
    owner: "Linda Park",
    addedOn: "2024-02-18",
    status: "Active",
  },
]

export default function CoursePage() {
  const [courses] = useState(mockCourses)

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
            <CardTitle className="text-2xl font-bold">Course Management</CardTitle>
            <CardDescription className="text-xs">
              Manage educational courses, including details, ownership, and availability
            </CardDescription>
          </div>
          <Link to="add-course">
            <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
              <Plus className="h-4 w-4" />
              Add Course
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Course Name</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs">Campus</TableHead>
                <TableHead className="text-xs">Sector</TableHead>
                <TableHead className="text-xs">Owner</TableHead>
                <TableHead className="text-xs">Added On</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium text-xs">{course.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{course.description}</TableCell>
                  <TableCell className="text-xs">{course.campus}</TableCell>
                  <TableCell className="text-xs">{course.sector}</TableCell>
                  <TableCell className="text-xs">{course.owner}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(course.addedOn).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-xs">{getStatusBadge(course.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`edit-course/${course.id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center gap-1 bg-theme text-white hover:bg-theme/90 text-xs"
                      >
                        <Edit className="h-3 w-3" />
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