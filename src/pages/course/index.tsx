import { useState, useEffect } from "react"
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
import { Edit, EllipsisVertical, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import axiosInstance from "@/lib/axios"
import moment from "moment"

export default function CoursePage() {
  const [courses, setCourses] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course")
        // assuming your API returns data in res.data.data.result
        setCourses(res.data.data.result)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    }
    fetchCourses()
  }, [])

  const getStatusBadge = (status: string) => {
    return status.toLowerCase() === "active" ? (
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
                <TableHead className="text-xs">Campus</TableHead>
                {/* <TableHead className="text-xs">Sector</TableHead>
                <TableHead className="text-xs">Owner</TableHead> */}
                <TableHead className="text-xs">Added On</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id || course.id}>
                  <TableCell className="font-medium text-xs">{course.courseName}</TableCell>
                  <TableCell className="text-xs">{course.campus}</TableCell>
                  {/* <TableCell className="text-xs">{course.sector}</TableCell>
                  <TableCell className="text-xs">{course.owner}</TableCell> */}
                  <TableCell className="text-xs">
                    {moment(course.createdAt).format("MMM D, YYYY")}
                  </TableCell>
                  <TableCell className="text-xs">{getStatusBadge(course.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-xs text-black"
                        >
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="border-gray-200 bg-white text-black"
                        align="end"
                      >
                        <DropdownMenuItem
                          className="text-xs hover:bg-theme"
                          onClick={() => navigate(`edit-course/${course._id || course.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-xs hover:bg-theme"
                          onClick={() => navigate(`${course._id || course.id}/modules`)}
                        >
                          Modules
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs hover:bg-theme text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
