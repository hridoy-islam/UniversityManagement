import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentProfile } from './components/student-profile';
import { PersonalDetailsForm } from './components/personal-details-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useSelector } from 'react-redux';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import EducationSection from './components/education-section';
import DocumentsSection from './components/documents-section';
import CommunicationPage from './components/communication-section';
import NotePage from './components/note-page';
import ProcessesPage from './components/processes-page';
import axiosInstance from '@/lib/axios';
import OfferPage from './components/offer-section';

// ─── Types ────────────────────────────────────────────────────────────────────

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
  studentId: string | {
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
    address?: string;
    nationality?: string;
    agent?: string;
    noDocuments?: boolean;
    documents?: any[];
    education?: any[];
    workExperience?: any[];
  };
  status: string;
  seen: boolean;
  refId: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentData {
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
  address?: string;
  nationality?: string;
  agent?: string;
  noDocuments?: boolean;
  documents?: any[];
  education?: any[];
  workExperience?: any[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ApplicantDetailsPage() {
  const { appId } = useParams();
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth) || {};
  const [application, setApplication] = useState<ApplicationCourse | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasRequiredDocuments, setHasRequiredDocuments] = useState(false);
  const navigate = useNavigate();

  // Dialog states
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ─── Fetch Application and Student Data ─────────────────────────────────────

  const fetchApplicationData = async () => {
    try {
      setInitialLoading(true);
      
      // Fetch application by ID
      const applicationRes = await axiosInstance.get(`/application-course/${appId}`);
      const applicationData: ApplicationCourse = applicationRes.data.data;
      setApplication(applicationData);
      
      // Get studentId from application
      let studentId: string;
      if (typeof applicationData.studentId === 'string') {
        studentId = applicationData.studentId;
      } else {
        studentId = applicationData.studentId._id;
      }
      
      // Fetch student data
      const studentRes = await axiosInstance.get(`/users/${studentId}`);
      const studentData: StudentData = studentRes.data.data;
      setStudent(studentData);
      
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load application details.',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (appId) {
      fetchApplicationData();
    }
  }, [appId]);

  // Update hasRequiredDocuments when student changes
  useEffect(() => {
    if (student) {
      const requiredDocuments = ['work experience', 'qualification'];
      const hasDocs = requiredDocuments.some((type) =>
        student.documents?.some((doc: any) => doc.file_type === type)
      );
      setHasRequiredDocuments(hasDocs || student.noDocuments || false);
    }
  }, [student]);

  // ─── Save Handler ──────────────────────────────────────────────────────────

  const handleSave = async (data: any) => {
    try {
      // Update student data via API
      const response = await axiosInstance.patch(`/users/${student?._id}`, data);
      
      if (response.data.success) {
        // Update local state
        setStudent((prev) => ({ ...prev, ...data }));
        
        toast({
          title: 'Success',
          description: 'Changes saved successfully.',
          className: 'bg-theme text-white'
        });
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      });
    }
  };

  // ─── Accept Handler ────────────────────────────────────────────────────────

  const handleAccept = async () => {
    if (!application?._id) return;
    
    setIsProcessing(true);
    try {
      const response = await axiosInstance.patch(`/application-course/${application._id}`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        setApplication((prev) => ({ ...prev!, status: 'approved' }));
        setIsAcceptDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Application accepted successfully.',
          className: 'bg-green-600 text-white'
        });
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept application.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Reject Handler ────────────────────────────────────────────────────────

  const handleReject = async () => {
    if (!application?._id) return;
    
    setIsProcessing(true);
    try {
      const response = await axiosInstance.patch(`/application-course/${application._id}`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        setApplication((prev) => ({ ...prev!, status: 'rejected' }));
        setIsRejectDialogOpen(false);
        toast({
          title: 'Success',
          description: 'Application rejected successfully.',
          className: 'bg-red-600 text-white'
        });
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject application.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Refresh Student Data ──────────────────────────────────────────────────

  const refreshStudentData = async () => {
    if (!student?._id) return;
    
    try {
      const studentRes = await axiosInstance.get(`/users/${student._id}`);
      const studentData: StudentData = studentRes.data.data;
      setStudent(studentData);
    } catch (error) {
      console.error('Error refreshing student data:', error);
    }
  };

  const activeTabClass =
    'data-[state=active]:bg-theme data-[state=active]:text-white';

  // Define tabs
  const tabs = [
    { value: 'personal', label: 'Personal Info' },
    { value: 'education', label: 'Education' },
    { value: 'offer', label: 'Offer' },
    { value: 'communication', label: 'Communication' },
    { value: 'documents', label: 'Uploaded Files' },
    { value: 'notes', label: 'Notes' },
    { value: 'Processes', label: 'Processes' }
  ];

  if (initialLoading) {
    return (
      <div className="flex justify-center py-6">
        <BlinkingDots size="large" color="bg-theme" />
      </div>
    );
  }

  if (!student || !application) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">Application not found.</p>
        <Button
          variant="outline"
          onClick={() => navigate('/applications')}
          className="mt-4"
        >
          Back to List
        </Button>
      </div>
    );
  }

  // Combine student and application data for components that need both
  const combinedData = {
    ...student,
    applicationId: application._id,
    applicationStatus: application.status,
    courseId: application.courseId,
    intakeId: application.intakeId,
    refId: application.refId
  };

  // Get student name for confirmation dialogs
  const studentName = `${student.firstName} ${student.lastName}`;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="border-none bg-theme text-white hover:bg-theme/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Show Accept/Reject buttons only if status is still 'applied' */}
          {application.status === 'applied' && (
            <>
             
              <Button 
                variant="destructive" 
                onClick={() => setIsRejectDialogOpen(true)}
                size={'lg'}
                className='px-16 text-lg'
              >
                Reject
              </Button>
            </>
          )}
          
          {/* Show current status badge if already processed */}
          {application.status !== 'applied' && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              application.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {application.status === 'approved' ? 'Approved' : 'Rejected'}
            </span>
          )}
        </div>
      </header>

      {/* Accept Confirmation Dialog */}
      <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-green-700">
              Accept Application
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-gray-600">
              Are you sure you want to accept the application for{' '}
              <span className="font-semibold text-gray-900">{studentName}</span>?
              <br />
              <br />
              This action will approve the student's application and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsAcceptDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <BlinkingDots size="small" color="bg-white" />
                  Processing...
                </div>
              ) : (
                'Yes, Accept Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              Reject Application
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm text-gray-600">
              Are you sure you want to reject the application for{' '}
              <span className="font-semibold text-gray-900">{studentName}</span>?
              <br />
              <br />
              This action will decline the student's application and cannot be undone.
              The student will be notified of this decision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <BlinkingDots size="small" color="bg-white" />
                  Processing...
                </div>
              ) : (
                'Yes, Reject Application'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentProfile
        student={combinedData}
        fetchStudent={refreshStudentData}
      />

      <Tabs defaultValue="personal" className="mt-1 px-2">
        <TabsList className="flex flex-wrap justify-start">
          {tabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className={activeTabClass}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsForm student={combinedData} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsSection
            student={combinedData}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="education">
          <EducationSection student={combinedData} onSave={handleSave} />
        </TabsContent>
        
        <TabsContent value="offer">
          <OfferPage student={combinedData} onSave={handleSave} />
        </TabsContent>
        <TabsContent value="communication">
          <CommunicationPage student={combinedData} onSave={handleSave} />
        </TabsContent>
        
        <TabsContent value="notes">
          <NotePage student={combinedData} onSave={handleSave} />
        </TabsContent>
        
        <TabsContent value="Processes">
          <ProcessesPage 
            student={combinedData} 
            application={application}
            onSave={handleSave} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}