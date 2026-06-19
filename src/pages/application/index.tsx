import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { EllipsisVertical, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import axiosInstance from '@/lib/axios';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { BlinkingDots } from '@/components/shared/blinking-dots';

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectOption = { value: string; label: string } | null;

interface ApplicationCourse {
  _id: string;
  courseId: {
    _id: string;
    name: string;
    status: number;
    courseCode: string;
  };
  intakeId: {
    _id: string;
    termName: string;
    status: number;
  };
  studentId: {
    _id: string;
    email: string;
    phone: string;
    title: string;
    firstName: string;
    lastName: string;
    initial: string;
    dateOfBirth: string;
    studentType: string;
    isCompleted: boolean;
  };
  status: string;
  seen: boolean;
  refId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const getStatusBadge = (status: string) => {
  if (status === 'Enrolled') {
    return (
      <Badge className="bg-green-100 text-xs text-green-800 hover:bg-green-100">
        Enrolled
      </Badge>
    );
  }
  if (status === 'Pending') {
    return (
      <Badge variant="secondary" className="text-xs">
        Pending
      </Badge>
    );
  }
  if (status === 'applied') {
    return (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-none">
        Applied
      </Badge>
    );
  }
  if (status === 'approved') {
    return (
      <Badge className="bg-green-100 text-xs text-green-800 hover:bg-green-100">
        Approved
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="text-xs">
      {status}
    </Badge>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplicantPage() {
  const navigate = useNavigate();

  // Data state
  const [applications, setApplications] = useState<ApplicationCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  

  // Filter states — pending (not yet committed)
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingIntake, setPendingIntake] = useState<SelectOption>(null);
  const [pendingCourse, setPendingCourse] = useState<SelectOption>(null);
  const [pendingStatus, setPendingStatus] = useState<SelectOption>(null);
  const [pendingDob, setPendingDob] = useState<Date | null>(null);

  // Committed filter states (applied on Search click)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntake, setSelectedIntake] = useState<SelectOption>(null);
  const [selectedCourse, setSelectedCourse] = useState<SelectOption>(null);
  const [selectedStatus, setSelectedStatus] = useState<SelectOption>(null);
  const [dob, setDob] = useState<Date | null>(null);

  // Options for selects
  const [intakeOptions, setIntakeOptions] = useState<SelectOption[]>([]);
  const [courseOptions, setCourseOptions] = useState<SelectOption[]>([]);
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([
    { value: 'applied', label: 'Applied' },
    { value: 'approved', label: 'Approved' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Enrolled', label: 'Enrolled' }
  ]);

  // ─── Fetch Filter Options ──────────────────────────────────────────────────

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch intakes
        const intakesRes = await axiosInstance.get('/terms', {
          params: { page: 1, limit: 'all' }
        });
        if (intakesRes.data?.data?.result) {
          setIntakeOptions(
            intakesRes.data.data.result.map((item: any) => ({
              value: item._id,
              label: item.termName
            }))
          );
        }

        // Fetch courses
        const coursesRes = await axiosInstance.get('/courses', {
          params: { page: 1, limit: 'all' ,status:1 }
        });
        if (coursesRes.data?.data?.result) {
          setCourseOptions(
            coursesRes.data.data.result
             );
          
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // ─── Fetch Data ────────────────────────────────────────────────────────────

  const fetchData = async (
    page = 1,
    limit ,
    search = '',
    intakeId?: string,
    courseId?: string,
    status?: string,
    dobFrom?: Date | null,
        offerType?: string

  ) => {
    try {
      setLoading(true);

      const params: Record<string, string | number> = { page, limit };
      
      if (search) params.searchTerm = search;
      if (intakeId) params.intakeId = intakeId;
      if (courseId) params.courseId = courseId;
      if (status) params.status = status;
      if (offerType) params.offerType = offerType;
      const res = await axiosInstance.get('/application-course', { params });
      const data: ApplicationCourse[] = res.data.data.result || [];
      
      setApplications(data);
      setTotalPages(res.data.data.meta.totalPage || 1);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + re-fetch when committed filters or page changes
useEffect(() => {
    fetchData(
      currentPage,
      entriesPerPage,
      searchTerm,
      selectedIntake?.value,
      selectedCourse?.value,
      selectedStatus?.value,
      dob,
      'none'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage, 
    entriesPerPage, 
    searchTerm, 
    selectedIntake, 
    selectedCourse, 
    selectedStatus, 
    dob,
    'none'
  ]);
  // ─── Handlers ───────────────────────────────────────────────────────────────
const handleSearch = () => {
    // Commit the pending filters to state
    setSearchTerm(pendingSearch);
    setSelectedIntake(pendingIntake);
    setSelectedCourse(pendingCourse);
    setSelectedStatus(pendingStatus);
    setDob(pendingDob);
    
    // Reset to the first page whenever a new search is performed
    setCurrentPage(1); 
  };

  const handleReset = () => {
    setPendingSearch('');
    setPendingIntake(null);
    setPendingCourse(null);
    setPendingStatus(null);
    setPendingDob(null);
    setSearchTerm('');
    setSelectedIntake(null);
    setSelectedCourse(null);
    setSelectedStatus(null);
    setDob(null);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex">
      <div className="flex-1 space-y-6">
        

        {/* Combined Card: Filters + Table */}
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div>
          <CardTitle className="text-2xl font-bold">Application List</CardTitle>
        </div>
            {/* Search & Filter Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs font-medium">Search</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Name, Email, Phone"
                    className="w-full rounded border border-gray-300 px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Intake</label>
                <Select
                  options={intakeOptions}
                  value={pendingIntake}
                  onChange={setPendingIntake}
                  placeholder="Select Intake"
                  isClearable
                  className="text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Course</label>
                <Select
                  options={courseOptions}
                  value={pendingCourse}
                  onChange={setPendingCourse}
                  placeholder="Select Course"
                  isClearable
                  className="text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Status</label>
                <Select
                  options={statusOptions}
                  value={pendingStatus}
                  onChange={setPendingStatus}
                  placeholder="Select Status"
                  isClearable
                  className="text-xs"
                />
              </div>

             

              <div className="flex items-end gap-2">
                <Button variant="default" size="sm" onClick={handleSearch} className="h-10 w-full">
                  Search
                </Button>
                <Button variant="outline" size="sm" onClick={handleReset} className="h-10 w-full">
                  Reset
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Phone</TableHead>
                    <TableHead className="text-xs">Intake</TableHead>
                    <TableHead className="text-xs">Courses</TableHead>
                    <TableHead className="text-right text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-8 text-center text-xs text-gray-400"
                      >
                       <BlinkingDots/>
                      </TableCell>
                    </TableRow>
                  ) : applications.length > 0 ? (
                    applications.map((application) => (
                      <TableRow
                        key={application._id}
                         onClick={() =>
                                  navigate(`${application._id}`)
                                }
                        className="transition-colors odd:bg-theme/5 even:bg-transparent hover:bg-gray-50 cursor-pointer"
                      >
                        <TableCell className="text-xs font-medium">
                          {application.studentId?.title && `${application.studentId.title} `}
                          {application.studentId?.firstName} {application.studentId?.lastName}
                           <br />
                          <span className="text-xs text-gray-500">
                            {application.studentId?.email}
                          </span>
                        </TableCell>
                       
                        <TableCell className="text-xs">
                          {application.studentId?.phone}
                         
                        </TableCell>
                        <TableCell className="text-xs">
                          {application.intakeId?.termName || '—'}
                        </TableCell>
                        <TableCell className="text-xs">
                          {application.courseId?.name || '—'}
                        </TableCell>
                        
                       
                        <TableCell className="text-right">
                          <Button  onClick={() =>
                                  navigate(`${application._id}`)
                                }>
                            <Eye className='h-4 w-4 mr-2'/> View
                          </Button>
                        
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-4 text-center text-xs text-gray-500"
                      >
                        No applicants match the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
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
    </div>
  );
}