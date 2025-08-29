import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EllipsisVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// External libraries
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

// Mock data
const mockStudents = [
  {
    id: 'STU001',
    campus: 'Watney College',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+880171234567',
    email: 'john.doe@email.com',
    intake: 'Fall 2024',
    courses: 'Business Administration',
    dob: '2002-05-15',
    gender: 'Male',
    stage: 'Interview',
    status: 'Enrolled'
  },
  {
    id: 'STU002',
    campus: 'North Campus',
    firstName: 'Sarah',
    lastName: 'Khan',
    phone: '+880181234567',
    email: 'sarah.khan@email.com',
    intake: 'Spring 2025',
    courses: 'Computer Science',
    dob: '2001-11-22',
    gender: 'Female',
    stage: 'Offer Sent',
    status: 'Pending'
  }
];

// Extract unique options for filters
const campuses = [...new Set(mockStudents.map((s) => s.campus))].map(
  (campus) => ({
    value: campus,
    label: campus
  })
);

const intakes = [...new Set(mockStudents.map((s) => s.intake))].map(
  (intake) => ({
    value: intake,
    label: intake
  })
);

const courses = [...new Set(mockStudents.map((s) => s.courses))].map(
  (course) => ({
    value: course,
    label: course
  })
);

const statuses = [
  { value: 'Enrolled', label: 'Enrolled' },
  { value: 'Pending', label: 'Pending' }
];

export default function StudentPage() {
  const navigate = useNavigate();
  const [students] = useState(mockStudents);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dob, setDob] = useState<Date | null>(null);

  // Status badge helper
  const getStatusBadge = (status: string) => {
    return status === 'Enrolled' ? (
      <Badge className="bg-green-100 text-xs text-green-800 hover:bg-green-100">
        Enrolled
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        {status}
      </Badge>
    );
  };

  // Filter logic
  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      fullName.includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.phone.includes(searchTerm);

    const matchesCampus =
      !selectedCampus || student.campus === selectedCampus.value;
    const matchesStatus =
      !selectedStatus || student.status === selectedStatus.value;
    const matchesIntake =
      !selectedIntake || student.intake === selectedIntake.value;
    const matchesCourse =
      !selectedCourse || student.courses === selectedCourse.value;

    const dobDate = new Date(student.dob);
    const matchesDob = !dob || dobDate >= dob;

    return (
      matchesSearch &&
      matchesCampus &&
      matchesStatus &&
      matchesIntake &&
      matchesCourse &&
      matchesDob
    );
  });

  return (
    <div className="flex">
      <div className="flex-1 space-y-6 ">
        {/* Single Card for Filters and Table */}
        <div>
          <CardTitle className="text-2xl font-bold">Application List</CardTitle>
        </div>
        <Card>
       

          {/* Filters Section */}
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div>
                <label className="mb-1 block text-xs font-medium">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name, Email, Phone"
                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Campus */}
              <div>
                <label className="mb-1 block text-xs font-medium">Campus</label>
                <Select
                  options={campuses}
                  value={selectedCampus}
                  onChange={setSelectedCampus}
                  placeholder="Select Campus"
                  isClearable
                  className="text-xs"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-xs font-medium">Status</label>
                <Select
                  options={statuses}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Select Status"
                  isClearable
                  className="text-xs"
                />
              </div>

              {/* Intake */}
              <div>
                <label className="mb-1 block text-xs font-medium">Intake</label>
                <Select
                  options={intakes}
                  value={selectedIntake}
                  onChange={setSelectedIntake}
                  placeholder="Select Intake"
                  isClearable
                  className="text-xs"
                />
              </div>

              {/* Course */}
              <div>
                <label className="mb-1 block text-xs font-medium">Course</label>
                <Select
                  options={courses}
                  value={selectedCourse}
                  onChange={setSelectedCourse}
                  placeholder="Select Course"
                  isClearable
                  className="text-xs"
                />
              </div>

              {/* DOB From */}
              <div>
                <label className="mb-1 block text-xs font-medium">
                  DOB From
                </label>
                <DatePicker
                  selected={dob}
                  onChange={(date: Date | null) => setDob(date)}
                  selectsStart
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select DOB"
                  isClearable
                  wrapperClassName="w-full"
                  className="w-full rounded border border-gray-300 px-3 py-2.5 text-xs"
                />
              </div>
            </div>
          </CardContent>

          {/* Student Table */}
          <CardContent className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Campus</TableHead>
                  <TableHead className="text-xs">Phone (Email)</TableHead>
                  <TableHead className="text-xs">Intake</TableHead>
                  <TableHead className="text-xs">Courses</TableHead>
                  <TableHead className="text-xs">DOB</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="transition-colors odd:bg-theme/5 even:bg-transparent hover:bg-gray-50"
                    >
                      <TableCell className="text-xs font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="text-xs">
                        {student.campus}
                      </TableCell>
                      <TableCell className="text-xs">
                        {student.phone}
                        <br />
                        <span className="text-xs text-gray-500">
                          {student.email}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs">
                        {student.intake}
                      </TableCell>
                      <TableCell className="text-xs">
                        {student.courses}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(student.dob).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {getStatusBadge(student.status)}
                      </TableCell>
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
                              className="cursor-pointer text-xs hover:bg-theme"
                              onClick={() => navigate('info-manager')}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-xs text-red-600 hover:bg-theme">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-6 text-center text-xs text-gray-500"
                    >
                      No students match the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
