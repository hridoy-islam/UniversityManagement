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
import { EllipsisVertical, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import VerticalNav from "@/components/shared/VericalNav"

// Mock data for students
const mockStudents = [
  {
    id: "STU001",
    campus: "Watney College",
    firstName: "John",
    lastName: "Doe",
    phone: "+880171234567",
    email: "john.doe@email.com",
    intake: "Fall 2024",
    courses: "Business Administration",
    dob: "2002-05-15",
    gender: "Male",
    stage: "Interview",
    status: "applied",
  },
  {
    id: "STU002",
    campus: "North Campus",
    firstName: "Sarah",
    lastName: "Khan",
    phone: "+880181234567",
    email: "sarah.khan@email.com",
    intake: "Spring 2025",
    courses: "Computer Science",
    dob: "2001-11-22",
    gender: "Female",
    stage: "Offer Sent",
    status: "applied",
  },
]

export default function ApplicantPage() {
  const navigate = useNavigate()
  const [students] = useState(mockStudents)

  const getStatusBadge = (statuses: string | string[]) => {
  const statusArray = Array.isArray(statuses) ? statuses : [statuses];

  return (
    <div className="flex flex-wrap gap-1">
      {statusArray.map((status, idx) => {
        if (status === "Enrolled") {
          return (
            <Badge
              key={idx}
              variant="default"
              className="bg-green-100 text-green-800 hover:bg-green-100 text-xs"
            >
              Enrolled
            </Badge>
          );
        } else if (status === "Pending") {
          return (
            <Badge key={idx} variant="secondary" className="text-xs">
              Pending
            </Badge>
          );
        } else {
          return (
            <Badge key={idx} variant="secondary" className="text-xs">
              {status}
            </Badge>
          );
        }
      })}
    </div>
  );
};


  return (
    <div className="text-xs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Applicant List</CardTitle>
            <CardDescription className="text-xs">
              Manage students, their applications, and enrollment status
            </CardDescription>
          </div>
          
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Student ID</TableHead>
                <TableHead className="text-xs">Campus</TableHead>
                <TableHead className="text-xs">First Name</TableHead>
                <TableHead className="text-xs">Last Name</TableHead>
                <TableHead className="text-xs">Phone (Email)</TableHead>
                <TableHead className="text-xs">Intake</TableHead>
                <TableHead className="text-xs">Courses</TableHead>
                <TableHead className="text-xs">Dob</TableHead>
                <TableHead className="text-xs">Gender</TableHead>
                <TableHead className="text-xs">Application Stage</TableHead>
                <TableHead className="text-xs">Status (Enrolled)</TableHead>
                <TableHead className="text-right text-xs">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-xs">{student.id}</TableCell>
                  <TableCell className="text-xs">{student.campus}</TableCell>
                  <TableCell className="text-xs">{student.firstName}</TableCell>
                  <TableCell className="text-xs">{student.lastName}</TableCell>
                  <TableCell className="text-xs">
                    {student.phone}
                    <br />
                    <span className="text-gray-500">{student.email}</span>
                  </TableCell>
                  <TableCell className="text-xs">{student.intake}</TableCell>
                  <TableCell className="text-xs">{student.courses}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(student.dob).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs">{student.gender}</TableCell>
                  <TableCell className="text-xs">{student.stage}</TableCell>
                  <TableCell className="text-xs">{getStatusBadge(student.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-xs text-black"
                        >
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white text-black border-gray-200 ">
                        <DropdownMenuItem className="hover:bg-theme "  onClick={() => navigate("applicant-details")}>Applicant Details</DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-theme ">Delete</DropdownMenuItem>
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
