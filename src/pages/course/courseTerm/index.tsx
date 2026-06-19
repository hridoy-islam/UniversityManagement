import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Loader2, Trash2, ArrowLeft, TableProperties } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useParams } from 'react-router-dom';

interface CourseType {
  _id: string;
  name: string;
}

interface CourseGroupType {
  _id: string;
  name: string;
}

interface CourseTermType {
  _id: string;
  name: string;
  courseId?: CourseType | string;
  groupId?: CourseGroupType | string;
  status: 'active' | 'inactive';
}

export default function CourseTermPage() {
  const { id: courseId, gid: groupId } = useParams<{ id: string; gid: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [courseTerms, setCourseTerms] = useState<CourseTermType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);

  // Form Configurations
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<CourseTermType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    courseId: courseId || '',
    groupId: groupId || '',
    status: 'active' as 'active' | 'inactive'
  });

  const [courseName, setCourseName] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Mutational Drop Triggers
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteTerm, setSelectedDeleteTerm] = useState<CourseTermType | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sync route param initializations accurately
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courseId: courseId || '',
      groupId: groupId || ''
    }));
  }, [courseId, groupId]);

  const fetchCourseTerms = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        ...(courseId ? { courseId } : {}),
        ...(groupId ? { groupId } : {})
      };
      if (courseId) {
        const courseRes = await axiosInstance.get(`/courses/${courseId}`);
        setCourseName(courseRes.data.data.name);
      }
      const res = await axiosInstance.get('/course-term', { params });
      const data = res.data.data.result;

      if (groupId) {
        const groupRes = await axiosInstance.get(`/course-group/${groupId}`);
        setGroupName(groupRes.data.data.name);
      }

      setTotalPages(res.data.data.meta?.totalPage || 1);
      setCourseTerms(data || []);
    } catch (error) {
      console.error('Failed to fetch course terms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch course terms. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseTerms(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage, courseId, groupId]);

  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedTerm(null);
    setFormData({
      name: '',
      courseId: courseId || '',
      groupId: groupId || '',
      status: 'active'
    });
    setDialogOpen(true);
  };

  const handleEdit = (term: CourseTermType) => {
    setIsEditing(true);
    setSelectedTerm(term);
    setFormData({
      name: term.name,
      courseId: typeof term.courseId === 'object' ? term.courseId._id : term.courseId || '',
      groupId: typeof term.groupId === 'object' ? term.groupId._id : term.groupId || '',
      status: term.status
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      name: '',
      courseId: courseId || '',
      groupId: groupId || '',
      status: 'active'
    });
    setSelectedTerm(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Course term name is required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: formData.name.trim(),
        status: formData.status,
        ...(formData.courseId ? { courseId: formData.courseId } : {}),
        ...(formData.groupId ? { groupId: formData.groupId } : {}),
      };

      if (isEditing && selectedTerm) {
        const res = await axiosInstance.patch(
          `/course-term/${selectedTerm._id}`,
          payload
        );

        const updatedData = res.data?.data || res.data;

        setCourseTerms((prevTerms) =>
          prevTerms.map((term) =>
            term._id === selectedTerm._id
              ? {
                  ...term,
                  ...updatedData,
                  name: formData.name.trim(),
                  status: formData.status,
                  courseId: formData.courseId
                    ? { _id: formData.courseId, name: courseName || "" }
                    : term.courseId,
                  groupId: formData.groupId
                    ? { _id: formData.groupId, name: groupName || "" }
                    : term.groupId,
                }
              : term
          )
        );

        toast({
          title: "Success",
          description: "Course term updated successfully.",
        });
      } else {
        const res = await axiosInstance.post("/course-term", payload);

        const newTerm = {
          ...res.data.data,
          courseId: formData.courseId
            ? { _id: formData.courseId, name: courseName || "" }
            : undefined,
          groupId: formData.groupId
            ? { _id: formData.groupId, name: groupName || "" }
            : undefined,
        };

        setCourseTerms((prevTerms) => [newTerm, ...prevTerms]);

        toast({
          title: "Success",
          description: "Course term created successfully.",
        });
      }

      handleDialogClose();
    } catch (error: any) {
      console.error("Failed to save course term:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save course term. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (term: CourseTermType) => {
    setSelectedDeleteTerm(term);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteTerm) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/course-term/${selectedDeleteTerm._id}`);

      setCourseTerms((prevTerms) => {
        const updatedTerms = prevTerms.filter((term) => term._id !== selectedDeleteTerm._id);
        if (updatedTerms.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return updatedTerms;
      });

      toast({
        title: 'Success',
        description: `${selectedDeleteTerm.name} has been deleted successfully.`
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteTerm(null);
    } catch (error) {
      console.error('Failed to delete course term:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course term. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="text-xs">
        <Card className="border-none shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0  px-0">
             <div>
              <CardTitle className="font-bold">
                {courseName && <div className="text-2xl">{courseName}</div>}

                {groupName && (
                  <div className="text-lg ">{groupName}'s Term</div>
                )}

                {!courseName && !groupName && (
                  <div className="text-2xl">Course Terms</div>
                )}
              </CardTitle>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className='h-4 w-4 mr-2'/>Back
              </Button>
              <Button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-theme text-xs text-white hover:bg-theme/90"
              >
                <Plus className="h-4 w-4" />
                Add Course Term
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <BlinkingDots />
              </div>
            ) : courseTerms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-4">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  No course terms found
                </h3>
                <p className="mb-4 text-gray-500">
                  Get started by adding your first course term
                </p>
              </div>
            ) : (
              <>
                {/* Clean Layout Uniformity: Grid Responsive Cards Mapping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {courseTerms.map((term) => (
   <Card
  key={term._id}
  onClick={() => navigate(`${term._id}/units`)}
  className="cursor-pointer hover:shadow-md transition-shadow duration-200 flex flex-col justify-between border min-h-[140px]"
>
  {/* Header with action items aligned cleanly to the top-right */}
  <CardHeader className=" flex flex-row items-center justify-end space-y-0">
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleEdit(term)}
        className="h-8 w-8 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteClick(term)}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </CardHeader>

  {/* Content completely centered in the remaining layout space */}
  <CardContent className="flex-grow flex items-center justify-center -mt-5 text-center">
    <p className="text-lg font-semibold tracking-tight text-gray-900 break-words w-full">
      {term.name}
    </p>
  </CardContent>
</Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 pt-6">
                    <DynamicPagination
                      pageSize={entriesPerPage}
                      setPageSize={setEntriesPerPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Input Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {isEditing ? 'Edit Course Term' : 'Add Course Term'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing
                ? 'Update the course term details below.'
                : 'Enter the details for the new course term.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="col-span-3 text-xs"
                placeholder="Enter course term name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-theme text-xs text-white hover:bg-theme/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course term
              {selectedDeleteTerm && (
                <span className="font-semibold">
                  {' '}
                  "{selectedDeleteTerm.name}"
                </span>
              )}{' '}
              and remove all associated data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-xs text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}