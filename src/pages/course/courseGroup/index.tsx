import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Plus, Loader2, Trash2, ArrowLeft } from 'lucide-react';
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
  code?: string;
}

interface CourseGroupType {
  _id: string;
  name: string;
  courseId: CourseType | string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export default function CourseGroupPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [courseGroups, setCourseGroups] = useState<CourseGroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<CourseGroupType | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: '',
    courseId: courseId || '',
    status: 'active' as 'active' | 'inactive'
  });
  const [courseName, setCourseName] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteGroup, setSelectedDeleteGroup] =
    useState<CourseGroupType | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Ensure formData remains accurately mapped if route initialization lags
  useEffect(() => {
    if (courseId) {
      setFormData((prev) => ({ ...prev, courseId }));
    }
  }, [courseId]);

  const fetchCourseGroups = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        ...(courseId ? { courseId } : {})
      };
      const res = await axiosInstance.get('/course-group', { params });
      const data = res.data.data.result;
      const res1 = await axiosInstance.get(`/courses/${courseId}`);
      setCourseName(res1.data.data.name);
      setTotalPages(res.data.data.meta?.totalPage || 1);

      setCourseGroups(data || []);
    } catch (error) {
      console.error('Failed to fetch course groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch course groups. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseGroups(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage, courseId]);

  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedGroup(null);
    setFormData({
      name: '',
      courseId: courseId || '',
      status: 'active'
    });
    setDialogOpen(true);
  };

  const handleEdit = (group: CourseGroupType) => {
    setIsEditing(true);
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      courseId:
        typeof group.courseId === 'object'
          ? group.courseId._id
          : group.courseId,
      status: group.status
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({
      name: '',
      courseId: courseId || '',
      status: 'active'
    });
    setSelectedGroup(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Course group name is required.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.courseId) {
      toast({
        title: 'Validation Error',
        description:
          'Associated contextual course parameter reference target is missing.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);

    try {
      if (isEditing && selectedGroup) {
        const res = await axiosInstance.patch(
          `/course-group/${selectedGroup._id}`,
          {
            name: formData.name.trim(),
            courseId: formData.courseId,
            status: formData.status
          }
        );

        const updatedData = res.data?.data || res.data;

        setCourseGroups((prevGroups) =>
          prevGroups.map((group) =>
            group._id === selectedGroup._id
              ? {
                  ...group,
                  ...updatedData,
                  name: formData.name.trim(),
                  status: formData.status,
                  courseId: {
                    _id: formData.courseId,
                    name: courseName
                  }
                }
              : group
          )
        );

        toast({
          title: 'Success',
          description: 'Course group updated successfully.'
        });
      } else {
        const res = await axiosInstance.post('/course-group', {
          name: formData.name.trim(),
          courseId: formData.courseId,
          status: formData.status
        });

        const newGroup = {
          ...res.data.data,
          courseId: {
            _id: formData.courseId,
            name: courseName
          }
        };

        setCourseGroups((prevGroups) => [newGroup, ...prevGroups]);

        toast({
          title: 'Success',
          description: 'Course group created successfully.'
        });
      }

      handleDialogClose();
    } catch (error: any) {
      console.error('Failed to save course group:', error);
      toast({
        title: 'Error',
        description:
          error.response?.data?.message ||
          'Failed to save course group. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (group: CourseGroupType) => {
    setSelectedDeleteGroup(group);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteGroup) return;

    setDeleting(true);
    try {
      await axiosInstance.delete(`/course-group/${selectedDeleteGroup._id}`);

      setCourseGroups((prevGroups) => {
        const updatedGroups = prevGroups.filter(
          (group) => group._id !== selectedDeleteGroup._id
        );
        if (updatedGroups.length === 0 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
        return updatedGroups;
      });

      toast({
        title: 'Success',
        description: `${selectedDeleteGroup.name} has been deleted successfully.`
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteGroup(null);
    } catch (error) {
      console.error('Failed to delete course group:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course group. Please try again.',
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">
                {`${courseName}'s Groups` || 'Course Groups'}
              </CardTitle>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-theme text-xs text-white hover:bg-theme/90"
              >
                <Plus className="h-4 w-4" />
                Add Course Group
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <BlinkingDots />
              </div>
            ) : courseGroups.length === 0 ? (
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  No course groups found
                </h3>
                <p className="mb-4 text-gray-500">
                  Get started by adding your first course group
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {courseGroups.map((group) => (
                    <Card
                      key={group._id}
                      onClick={() => navigate(`${group._id}/terms`)}
                      className="flex min-h-[140px] cursor-pointer flex-col justify-between border transition-shadow duration-200 hover:shadow-md"
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
                            onClick={() => handleEdit(group)}
                            className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(group)}
                            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>

                      {/* Content completely centered in the remaining layout space */}
                      <CardContent className="-mt-5 flex flex-grow items-center justify-center text-center">
                        <p className="w-full break-words text-lg font-semibold tracking-tight text-gray-900">
                          {group.name}
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

      {/* Main Mutational Configurator Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {isEditing ? 'Edit Course Group' : 'Add Course Group'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing
                ? 'Update the course group details below.'
                : 'Enter the details for the new course group.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">
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
                placeholder="Enter course group name"
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

      {/* Persistent destructive Action Alerts */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course group
              {selectedDeleteGroup && (
                <span className="font-semibold">
                  {' '}
                  "{selectedDeleteGroup.name}"
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
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Deleting...
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
