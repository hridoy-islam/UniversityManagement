import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Users2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { BlinkingDots } from "@/components/shared/blinking-dots";
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

// Updated to match your exact backend response structure
interface CourseType {
  _id: string;
  name: string;
  courseCode: string;
  description?: string;
  status: number; // 1 for active, 0 for inactive
  intakeId?: {
    _id: string;
    termName: string;
    status: number;
  };
  awardingBodyId?: {
    _id: string;
    name: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CoursePage() {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCourses = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      const res = await axiosInstance.get("/courses", { params });
      const data = res.data.data.result;
      setTotalPages(res.data.data.meta?.totalPage || 1);
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleStatusChange = async (courseId: string, newStatus: number) => {
    // Optimistically update the UI
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course._id === courseId ? { ...course, status: newStatus } : course
      )
    );

    try {
      await axiosInstance.patch(`/courses/${courseId}`, {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: `Status updated successfully.`,
      });
    } catch (error) {
      // Revert the status if the API call fails
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course._id === courseId ? { ...course, status: newStatus === 1 ? 0 : 1 } : course
        )
      );
      
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Inactive
      </Badge>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Course Management</CardTitle>
            </div>
            <Link to="add-course">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <BlinkingDots/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (courses.length === 0) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Course Management</CardTitle>
            </div>
            <Link to="add-course">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <svg
                  className="h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No courses found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first course
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show table with data
  return (
    <div className="text-xs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Course Management</CardTitle>
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
                <TableHead className="text-xs">Course Code</TableHead>
                <TableHead className="text-xs">Intake</TableHead>
                <TableHead className="text-xs">Awarding Body</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course._id} className="cursor-pointer" >
                  <TableCell className="font-medium text-xs cursor-pointer" onClick={()=> navigate(`${course._id}/groups`)}>{course.name}</TableCell>
                  <TableCell className="text-xs cursor-pointer" onClick={()=> navigate(`${course._id}/groups`)}>{course.courseCode}</TableCell>
                  <TableCell className="text-xs cursor-pointer" onClick={()=> navigate(`${course._id}/groups`)}>
                    {course.intakeId?.termName || <span className="text-gray-400">—</span>}
                  </TableCell>
                  <TableCell className="text-xs cursor-pointer" onClick={()=> navigate(`${course._id}/groups`)}>
                    {course.awardingBodyId?.name || <span className="text-gray-400">—</span>}
                  </TableCell>
                  
                  <TableCell className="text-xs cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={course.status === 1}
                        onCheckedChange={(checked) => 
                          handleStatusChange(course._id, checked ? 1 : 0)
                        }
                      />
                      {getStatusBadge(course.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* <Link to={`${course._id}/groups`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                        >
                          <Users2 className="h-4 w-4" />
                          Group
                        </Button>
                      </Link> */}
                      <Link to={`edit-course/${course._id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      {/* <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2 text-xs"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <DynamicPagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}