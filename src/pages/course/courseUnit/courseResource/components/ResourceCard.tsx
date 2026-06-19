import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  GraduationCap,
  BookOpen,
  BookA as BookAIcon,
  FileText,
  Clock,
  Pencil,
  Trash2,
  Target,
  Plus,
  MoveLeft,
  File,
  X,
  CheckCircle,
  Eye,
  AlertCircle,
  MessageSquare,
  Download,
  Upload,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  ArrowRight
} from 'lucide-react';
import moment from 'moment';
import { Resource } from './types';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { BlinkingDots } from '@/components/shared/blinking-dots';

interface UploadState {
  selectedDocument: string | null;
  fileName: string | null;
}

interface ResourceCardProps {
  resource: Resource;
  studentSubmission?: any;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  applicationId: any;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  studentSubmission,
  onEdit,
  onDelete,
  applicationId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id, unitId } = useParams();
  const user = useSelector((state: any) => state.auth.user);
  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getResourceTypeConfig = (type: string) => {
    switch (type) {
      case 'introduction':
        return {
          icon: <GraduationCap className="h-4 w-4" />,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'Introduction'
        };
      case 'study-guide':
        return {
          icon: <BookOpen className="h-4 w-4" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Study Guide'
        };
      case 'lecture':
        return {
          icon: <BookAIcon className="h-4 w-4" />,
          color: 'bg-violet-50 text-violet-700 border-violet-200',
          label: 'Lecture'
        };
      case 'assignment':
        return {
          icon: <FileText className="h-4 w-4" />,
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Assignment'
        };
      default:
        return {
          icon: <FileText className="h-4 w-4" />,
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          label: 'Resource'
        };
    }
  };

  // Delete confirmation component
  const DeleteConfirmDialog = () => (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Delete Resource</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete this resource? This action cannot be
            undone and all associated data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete(resource._id);
              setDeleteDialogOpen(false);
            }}
            className="w-full sm:w-auto"
          >
            Delete Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Assignment Card
  if (resource.type === 'assignment') {
    const [threadData, setThreadData] = useState<{
      assignment: any;
    } | null>(null);

    useEffect(() => {
      if (!isStudent || !user?._id || !id || !unitId) return;

      const loadAssignment = async () => {
        try {
          const assignmentRes = await axiosInstance.get(
            `/assignment?studentId=${user._id}&assignmentName=${encodeURIComponent(resource.title)}&unitId=${unitId}`
          );

          const assignmentData = Array.isArray(assignmentRes.data.data.result)
            ? assignmentRes.data.data.result[0]
            : assignmentRes.data.data;

          setThreadData({
            assignment: assignmentData
          });
        } catch (err) {
          console.error('Failed to load assignment', err);
          toast({
            title: 'Error',
            description: 'Could not load assignment.',
            variant: 'destructive'
          });
        }
      };

      loadAssignment();
    }, [isStudent, user?._id, id, unitId]);

    const isOverdue = resource.deadline
      ? moment(resource.deadline).isBefore(moment())
      : false;

    return (
      <>
        <div className="group relative rounded-lg border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <FileText className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900">
                  {resource.title}
                </h3>
                {resource.deadline && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span
                      className={
                        isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'
                      }
                    >
                      Due {moment(resource.deadline).format('MMM D, YYYY')}
                    </span>
                    {isOverdue && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-red-200 bg-red-50 text-xs text-red-700"
                      >
                        Overdue
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(resource)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4 text-slate-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                </Button>
              </div>
            )}
          </div>

          {/* Student Action */}
          {isStudent && applicationId && (
            <Button
              onClick={() =>
                navigate(
                  `/dashboard/student-applications/${applicationId}/assignment/${user._id}/unit-assignments/${unitId}`,
                  { state: { assignmentId: threadData?.assignment?._id } }
                )
              }
              variant="outline"
              className="w-full justify-between border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <span>View Assignment Details</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DeleteConfirmDialog />
      </>
    );
  }

  // Introduction Card
  if (resource.type === 'introduction') {
    return (
      <>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Introduction
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Course overview and objectives
                  </CardDescription>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(resource)}
                    className="h-9 w-9 p-0"
                  >
                    <Pencil className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="h-9 w-9 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose prose-slate max-w-none">
              <div
                className="text-sm leading-relaxed text-slate-700 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: resource.content || '' }}
              />
            </div>
          </CardContent>
        </Card>
        <DeleteConfirmDialog />
      </>
    );
  }

  // Learning Outcome
  if (resource.type === 'learning-outcome') {
    return (
      <>
        <AccordionItem
          key={resource._id}
          value={resource._id}
          className="border-slate-200"
        >
          <AccordionTrigger className="px-4 py-4 hover:bg-slate-50 hover:no-underline">
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-50">
                  <Target className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium text-slate-900">
                    {resource.learningOutcomes || 'Learning Outcome'}
                  </span>
                  {isAdmin && (
                    <div className="mt-1 flex gap-1.5">
                      {resource?.finalFeedback && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          Final Feedback
                        </Badge>
                      )}
                      {resource?.observation && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          Observation
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(resource);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteDialogOpen(true);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                  </Button>
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            {resource.assessmentCriteria &&
            resource.assessmentCriteria.length > 0 ? (
              <div className="space-y-3">
                {resource.assessmentCriteria.map((criteria, index) => (
                  <div
                    key={criteria._id}
                    className="rounded-lg border border-slate-100 bg-slate-50/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm leading-relaxed text-slate-700">
                        {criteria.description ? (
                          <div
                            className="[&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5"
                            dangerouslySetInnerHTML={{
                              __html: criteria.description
                            }}
                          />
                        ) : (
                          <span className="italic text-slate-400">
                            No description available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
                <p className="text-sm text-slate-500">
                  No assessment criteria defined yet
                </p>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
        <DeleteConfirmDialog />
      </>
    );
  }

  // Default: study-guide, lecture
  const typeConfig = getResourceTypeConfig(resource.type);

  return (
    <>
      <AccordionItem
        key={resource._id}
        value={resource._id}
        className="border-slate-200"
      >
        <AccordionTrigger className="px-4 py-4 hover:bg-slate-50 hover:no-underline">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md ${typeConfig.color}`}
              >
                {typeConfig.icon}
              </div>
              <div className="flex-1 text-left">
                <span className="text-sm font-medium text-slate-900">
                  {resource.title}
                </span>
                <p className="mt-0.5 text-xs text-slate-500">
                  {typeConfig.label}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(resource);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4 text-slate-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialogOpen(true);
                  }}
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                </Button>
              </div>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 pt-2">
          <div className="space-y-4">
            {/* Rich text content */}
            {resource.content?.trim() && (
              <div className="rounded-lg border border-slate-100 bg-white p-4">
                <div
                  className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5"
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                />
              </div>
            )}

            {/* File attachment */}
            {resource.fileUrl?.trim() && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white border border-slate-200">
                    <File className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {resource.fileName || 'Attached File'}
                    </p>
                    <p className="text-xs text-slate-500">Click to view</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href={resource.fileUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                </Button>
              </div>
            )}

            {/* Empty state */}
            {!resource.content?.trim() && !resource.fileUrl?.trim() && (
              <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center">
                <File className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No content available</p>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      <DeleteConfirmDialog />
    </>
  );
};

export default ResourceCard;