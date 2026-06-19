import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Plus,
  FileText,
  MoveLeft,
  Pen,
  Trash2,
  CalendarDays,
  Clock,
  DoorOpen,
  CalendarPlus,
  User,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import axiosInstance from '@/lib/axios';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface CourseUnit {
  _id: string;
  courseId: string;
  groupId: string;
  termId: string;
  unitReference: string;
  title: string;
  level: string;
  gls: string;
  credit: string;
}

interface RoutineEntry {
  classDate: string;
  startTime?: string;
  endTime?: string;
  roomNumber?: string;
  teacherId?: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
}

interface ClassRoutine {
  _id: string;
  courseId: string;
  groupId: string;
  termId: string;
  courseRoutine: RoutineEntry[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr) return '—';
  return moment.utc(dateStr).local().format('ddd, DD MMM YYYY');
}

function formatTime(timeStr?: string) {
  return timeStr || '—';
}

const handleTimeBlur = (value: string, onChange: (val: string) => void) => {
  let clean = value.trim();
  if (clean) {
    const m = moment(clean, ['HH:mm', 'H:mm', 'HHmm', 'Hmm', 'H']);
    if (m.isValid()) clean = m.format('HH:mm');
  }
  onChange(clean);
};

// ─────────────────────────────────────────────
// Routine Table Component
// ─────────────────────────────────────────────

interface RoutineTableProps {
  routines: RoutineEntry[];
  loading: boolean;
  canEdit: boolean;
  onAdd: () => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function RoutineTable({ routines, loading, canEdit, onAdd, onEdit, onDelete }: RoutineTableProps) {
  if (loading) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CalendarDays className="h-4 w-4 text-theme" />
            Class Routines
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <BlinkingDots size="large" color="bg-theme" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <CalendarDays className="h-4 w-4 text-theme" />
            Class Routines
          </CardTitle>
         
        </div>
        {canEdit && (
          <Button
            size="sm"
            className="bg-theme text-white hover:bg-theme/90"
            onClick={onAdd}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Routine
          </Button>
        )}
      </CardHeader>

      <CardContent>
        {routines.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CalendarPlus className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No routines scheduled</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="text-xs font-semibold">#</TableHead> */}
                  <TableHead className="text-xs font-semibold">Date</TableHead>
                  <TableHead className="text-xs font-semibold">Time</TableHead>
                  <TableHead className="text-xs font-semibold">Room</TableHead>
                  {/* <TableHead className="text-xs font-semibold">Teacher</TableHead> */}
                  {canEdit && <TableHead className="text-right text-xs font-semibold">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {routines.map((routine, index) => (
                  <TableRow key={index} className="hover:bg-muted/5">
                   
                    <TableCell className="py-3 text-sm font-medium">
                      {formatDate(routine.classDate)}
                    </TableCell>
                    <TableCell className="py-3 text-sm">
                      {routine.startTime || routine.endTime
                        ? `${formatTime(routine.startTime)} – ${formatTime(routine.endTime)}`
                        : '—'}
                    </TableCell>
                    <TableCell className="py-3 text-sm">
                      {routine.roomNumber || '—'}
                    </TableCell>
                   
                    {canEdit && (
  <TableCell className="py-3 text-right">
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="default"
              onClick={() => onEdit(index)}
              className="bg-theme text-white hover:bg-theme/90"
            >
              <Pen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit Routine</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(index)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete Routine</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </TableCell>
)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

function CourseUnitPage() {
  const { id: courseId, gid: groupId, tid: termId } = useParams();
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  // ── Units state ──────────────────────────────
  const [units, setUnits] = useState<CourseUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<CourseUnit | null>(null);

  // Unit form
  const [unitReference, setUnitReference] = useState('');
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState('');
  const [gls, setGls] = useState('');
  const [credit, setCredit] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Header meta
  const [courseName, setCourseName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [termName, setTermName] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // ── Routine state ────────────────────────────
  const [routines, setRoutines] = useState<RoutineEntry[]>([]);
  const [routineId, setRoutineId] = useState<string | null>(null);
  const [routineLoading, setRoutineLoading] = useState(true);
  const [routineDialogOpen, setRoutineDialogOpen] = useState(false);
  const [isEditingRoutine, setIsEditingRoutine] = useState(false);
  const [editingRoutineIndex, setEditingRoutineIndex] = useState<number | null>(null);
  const [routineDeleteDialogOpen, setRoutineDeleteDialogOpen] = useState(false);
  const [deletingRoutineIndex, setDeletingRoutineIndex] = useState<number | null>(null);
  const [routineSubmitting, setRoutineSubmitting] = useState(false);

  // Routine form
  const [classDate, setClassDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [teacherId, setTeacherId] = useState('');

  // ── Fetch units + meta ───────────────────────
  const fetchData = async (page = 1, limit = entriesPerPage) => {
    if (!courseId) return;
    try {
      setLoading(true);

      const courseRes = await axiosInstance.get(`/courses/${courseId}`);
      setCourseName(courseRes.data?.data?.name || 'Course');

      if (groupId) {
        const groupRes = await axiosInstance.get(`/course-group/${groupId}`);
        setGroupName(groupRes.data?.data?.name || '');
      }

      if (termId) {
        const termRes = await axiosInstance.get(`/course-term/${termId}`);
        setTermName(termRes.data?.data?.name || '');
      }

      const unitsRes = await axiosInstance.get('/course-unit', {
        params: { courseId, groupId, termId, page, limit }
      });

      setUnits(unitsRes.data?.data?.result || []);
      setTotalPages(unitsRes.data?.data?.meta?.totalPages || 1);
      setCurrentPage(page);
    } catch {
      toast({ title: 'Error', description: 'Failed to load course units.', variant: 'destructive' });
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch routines ────────────────────────────
  const fetchRoutines = async () => {
    if (!courseId || !groupId || !termId) return;
    try {
      setRoutineLoading(true);
      const res = await axiosInstance.get('/course-routine', {
        params: { courseId, groupId, termId }
      });
      // Get the first document (one per term) and extract its courseRoutine array
      const routineDoc = res.data?.data?.result?.[0];
      if (routineDoc) {
        setRoutineId(routineDoc._id);
        setRoutines(routineDoc.courseRoutine || []);
      } else {
        setRoutineId(null);
        setRoutines([]);
      }
    } catch {
      setRoutineId(null);
      setRoutines([]);
    } finally {
      setRoutineLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData(currentPage, entriesPerPage);
      fetchRoutines();
    }
  }, [courseId, groupId, termId, currentPage, entriesPerPage]);

  // ── Unit dialog helpers ──────────────────────
  const openAddDialog = () => {
    setIsEditing(false);
    setCurrentUnitId(null);
    setUnitReference(''); setTitle(''); setLevel(''); setGls(''); setCredit('');
    setDialogOpen(true);
  };

  const openEditDialog = (unit: CourseUnit) => {
    setIsEditing(true);
    setCurrentUnitId(unit._id);
    setUnitReference(unit.unitReference || '');
    setTitle(unit.title || '');
    setLevel(unit.level || '');
    setGls(unit.gls || '');
    setCredit(unit.credit || '');
    setDialogOpen(true);
  };

  const openDeleteDialog = (unit: CourseUnit) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!unitReference.trim() || !title.trim() || !level.trim() || !gls.trim() || !credit.trim()) {
      toast({ title: 'Error', description: 'All fields are required.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const payload = { courseId, groupId, termId, unitReference, title, level, gls, credit };
      if (isEditing && currentUnitId) {
        await axiosInstance.patch(`/course-unit/${currentUnitId}`, payload);
        toast({ title: 'Unit updated successfully!' });
      } else {
        await axiosInstance.post('/course-unit', payload);
        toast({ title: 'Unit added successfully!' });
      }
      fetchData(currentPage, entriesPerPage);
      setDialogOpen(false);
    } catch {
      toast({ title: 'Error', description: isEditing ? 'Failed to update unit.' : 'Failed to add unit.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!unitToDelete) return;
    try {
      await axiosInstance.delete(`/course-unit/${unitToDelete._id}`);
      toast({ title: 'Unit deleted successfully!' });
      fetchData(currentPage, entriesPerPage);
      setDeleteDialogOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete unit.', variant: 'destructive' });
    }
  };

  const handleUnit = (unit: CourseUnit) => navigate(`${unit._id}/modules`);

  // ── Routine dialog helpers ───────────────────
  const openAddRoutineDialog = () => {
    setIsEditingRoutine(false);
    setEditingRoutineIndex(null);
    setClassDate(null); 
    setStartTime(''); 
    setEndTime(''); 
    setRoomNumber(''); 
    setTeacherId('');
    setRoutineDialogOpen(true);
  };

  const openEditRoutineDialog = (index: number) => {
    const routine = routines[index];
    if (!routine) return;
    
    setIsEditingRoutine(true);
    setEditingRoutineIndex(index);
    // Parse the UTC date to local date for the datepicker
setClassDate(routine.classDate ? new Date(routine.classDate) : null);    setStartTime(routine.startTime || '');
    setEndTime(routine.endTime || '');
    setRoomNumber(routine.roomNumber || '');
    setTeacherId(typeof routine.teacherId === 'object' && routine.teacherId !== null 
      ? routine.teacherId._id || '' 
      : (routine.teacherId as string) || '');
    setRoutineDialogOpen(true);
  };

  const openDeleteRoutineDialog = (index: number) => {
    setDeletingRoutineIndex(index);
    setRoutineDeleteDialogOpen(true);
  };

  const handleRoutineSubmit = async () => {
    if (!classDate) {
      toast({ title: 'Error', description: 'Class date is required.', variant: 'destructive' });
      return;
    }
    setRoutineSubmitting(true);
    try {
      // Create the date at noon UTC to avoid timezone issues
const formattedDate = new Date(
  Date.UTC(
    classDate!.getFullYear(),
    classDate!.getMonth(),
    classDate!.getDate()
  )
).toISOString();      
      const newRoutineEntry: RoutineEntry = {
        classDate: formattedDate,
        ...(startTime ? { startTime } : {}),
        ...(endTime ? { endTime } : {}),
        ...(roomNumber ? { roomNumber } : {}),
        ...(teacherId ? { teacherId } : {})
      };

      let updatedRoutines: RoutineEntry[];

      if (isEditingRoutine && editingRoutineIndex !== null) {
        // Replace the routine at the specified index
        updatedRoutines = [...routines];
        updatedRoutines[editingRoutineIndex] = newRoutineEntry;
      } else {
        // Add new routine to the array
        updatedRoutines = [...routines, newRoutineEntry];
      }

      if (routineId) {
        // If course-routine document exists, PATCH to update the array
        await axiosInstance.patch(`/course-routine/${routineId}`, {
          courseId,
          groupId,
          termId,
          courseRoutine: updatedRoutines
        });
        toast({ title: isEditingRoutine ? 'Routine updated successfully!' : 'Routine added successfully!' });
      } else {
        // If no course-routine document exists, POST to create new one
        const payload = {
          courseId,
          groupId,
          termId,
          courseRoutine: [newRoutineEntry] // Create with single entry
        };
        await axiosInstance.post('/course-routine', payload);
        toast({ title: 'Routine created successfully!' });
      }

      fetchRoutines();
      setRoutineDialogOpen(false);
    } catch {
      toast({
        title: 'Error',
        description: isEditingRoutine ? 'Failed to update routine.' : 'Failed to add routine.',
        variant: 'destructive'
      });
    } finally {
      setRoutineSubmitting(false);
    }
  };

  const handleRoutineDelete = async () => {
    if (deletingRoutineIndex === null) return;
    try {
      // Remove the routine at the specified index
      const updatedRoutines = routines.filter((_, i) => i !== deletingRoutineIndex);

      if (!routineId) {
        toast({ title: 'Error', description: 'No routine found to delete.', variant: 'destructive' });
        return;
      }

      if (updatedRoutines.length === 0) {
        // If no routines left, delete the entire document
        await axiosInstance.delete(`/course-routine/${routineId}`);
        setRoutineId(null);
      } else {
        // Update with remaining routines
        await axiosInstance.patch(`/course-routine/${routineId}`, {
          courseId,
          groupId,
          termId,
          courseRoutine: updatedRoutines
        });
      }
      
      toast({ title: 'Routine deleted successfully!' });
      fetchRoutines();
      setRoutineDeleteDialogOpen(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete routine.', variant: 'destructive' });
    }
  };

  const canEdit = user?.role !== 'student';

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div>
      {/* ── Delete Unit Dialog ── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the unit{' '}
              <span className="font-semibold">"{unitToDelete?.title}"</span> and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Routine Dialog ── */}
      <Dialog open={routineDeleteDialogOpen} onOpenChange={setRoutineDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Routine Session?</DialogTitle>
            <DialogDescription>
              This will permanently remove this class routine session.
              {routines.length <= 1 && ' Since this is the last session, the entire routine will be deleted.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRoutineDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRoutineDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Routine Add/Edit Dialog ── */}
      <Dialog open={routineDialogOpen} onOpenChange={setRoutineDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditingRoutine 
                ? `Edit Routine ${(editingRoutineIndex ?? 0) + 1}` 
                : `Add Routine`}
            </DialogTitle>
            <DialogDescription>
              {isEditingRoutine ? 'Update the routine details below.' : 'Add a new class routine .'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="classDate">Class Date <span className="text-red-500">*</span></Label>
              <DatePicker
                selected={classDate}
              onChange={(date: Date | null) => {
  setClassDate(date);
}}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                dateFormat="dd-MM-yyyy"
                placeholderText="Select class date"
                wrapperClassName="w-full"
                preventOpenOnFocus
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  placeholder="09:00"
                  maxLength={5}
                  className="font-mono"
                  value={startTime}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
                    if (val.length === 2 && startTime.length === 1 && !val.includes(':')) {
                      val += ':';
                    }
                    setStartTime(val);
                  }}
                  onBlur={(e) => handleTimeBlur(e.target.value, setStartTime)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  placeholder="17:00"
                  maxLength={5}
                  className="font-mono"
                  value={endTime}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9:]/g, '').slice(0, 5);
                    if (val.length === 2 && endTime.length === 1 && !val.includes(':')) {
                      val += ':';
                    }
                    setEndTime(val);
                  }}
                  onBlur={(e) => handleTimeBlur(e.target.value, setEndTime)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., A101"
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher</Label>
              <Input
                id="teacherId"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Teacher ID or name"
              />
            </div> */}

            <div className="flex flex-col-reverse justify-between gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-2">
              <Button variant="outline" onClick={() => setRoutineDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleRoutineSubmit}
                disabled={routineSubmitting}
                className="bg-theme text-white hover:bg-theme/90"
              >
                {routineSubmitting
                  ? isEditingRoutine ? 'Updating...' : 'Adding...'
                  : isEditingRoutine ? 'Update Routine' : 'Add Routine'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Main Layout: Units (left) + Routine (right) ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

        {/* ── Units Card ── */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-6">
              <div>
                <CardTitle className="text-2xl font-bold">{courseName}'s Units</CardTitle>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
                  {groupName && (
                    <>
                      <span className="text-black">
                        Group: <span className="font-semibold">{groupName}</span>
                      </span>
                      {termName && <span>|</span>}
                    </>
                  )}
                  {termName && (
                    <span className="text-black">
                      Term: <span className="font-semibold">{termName}</span>
                    </span>
                  )}
                </div>
              </div>

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <Button
                    className="w-full justify-center bg-theme text-white hover:bg-theme/90 sm:w-auto"
                    onClick={() => navigate(-1)}
                    size="sm"
                  >
                    <MoveLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {canEdit && (
                    <DialogTrigger asChild>
                      <Button
                        className="w-full justify-center bg-theme text-white hover:bg-theme/90 sm:w-auto"
                        onClick={openAddDialog}
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Unit
                      </Button>
                    </DialogTrigger>
                  )}
                </div>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Course Unit' : 'Add New Course Unit'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="unitRef">Unit Reference</Label>
                        <Input id="unitRef" value={unitReference} onChange={(e) => setUnitReference(e.target.value)} placeholder="e.g., CS101" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Introduction to Programming" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="level">Level</Label>
                        <Input id="level" value={level} type="number" min="0" onChange={(e) => setLevel(e.target.value)} placeholder="e.g., 4" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gls">GLS</Label>
                        <Input id="gls" type="number" min="0" value={gls} onChange={(e) => setGls(e.target.value)} placeholder="e.g., 3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credit">Credit</Label>
                        <Input id="credit" type="number" min="0" value={credit} onChange={(e) => setCredit(e.target.value)} placeholder="e.g., 15" />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse justify-between gap-2 pt-4 sm:flex-row sm:justify-end sm:gap-2">
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSubmit} disabled={submitting} className="bg-theme text-white hover:bg-theme/90">
                        {submitting
                          ? isEditing ? 'Updating...' : 'Adding...'
                          : isEditing ? 'Update' : 'Add Unit'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <BlinkingDots size="large" color="bg-theme" />
                </div>
              ) : units.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium text-muted-foreground">No course units added yet</h3>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Unit Reference</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>GLS</TableHead>
                          <TableHead>Credit</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {units.map((unit) => (
                          <TableRow key={unit._id}>
                            <TableCell>{unit.unitReference}</TableCell>
                            <TableCell>{unit.title}</TableCell>
                            <TableCell>{unit.level}</TableCell>
                            <TableCell>{unit.gls}</TableCell>
                            <TableCell>{unit.credit}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="default"
                                        onClick={() => handleUnit(unit)}
                                        className="flex flex-row items-center gap-2 bg-theme text-white hover:bg-theme/90"
                                      >
                                        <FileText className="h-4 w-4" />
                                        View Details
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Details</p></TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {canEdit && (
                                  <>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button size="sm" variant="default" onClick={() => openEditDialog(unit)} className="bg-theme text-white hover:bg-theme/90">
                                            <Pen className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Edit</p></TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(unit)} className="bg-red-600 hover:bg-red-700">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Delete</p></TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-4 w-full max-md:flex max-md:scale-75 max-md:justify-center">
                      <DataTablePagination
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

        {/* ── Routine Table ── */}
        <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0">
          <RoutineTable
            routines={routines}
            loading={routineLoading}
            canEdit={canEdit}
            onAdd={openAddRoutineDialog}
            onEdit={openEditRoutineDialog}
            onDelete={openDeleteRoutineDialog}
          />
        </div>
      </div>
    </div>
  );
}

export default CourseUnitPage;