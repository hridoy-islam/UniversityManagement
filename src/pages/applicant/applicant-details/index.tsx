import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Printer, Plus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentProfile } from './components/student-profile';
import { PersonalDetailsForm } from './components/personal-details-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SendEmailComponent } from './components/send-email-component';
import { NotesPage } from './components/notes';

import { useToast } from '@/components/ui/use-toast';

import { useSelector } from 'react-redux';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import EducationSection from './components/education-section';
import DocumentsSection from './components/documents-section';

// Mock Student Data
const mockStudent = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+44 7123 456789',
  dateOfBirth: '1995-06-15',
  nationality: 'British',
  address: '123 Main St, London, UK',
  agent: 'agent123',
  noDocuments: false,
  documents: [
    { file_type: 'qualification', name: 'Degree Certificate', url: '#' },
    { file_type: 'work experience', name: 'Employment Letter', url: '#' }
  ],
  education: [
    {
      institution: 'University of London',
      degree: 'BSc Computer Science',
      startDate: '2013-09-01',
      endDate: '2017-06-30'
    }
  ],
  workExperience: [
    {
      company: 'TechCorp Ltd',
      role: 'Software Developer',
      startDate: '2017-07-01',
      endDate: '2020-08-31',
      description: 'Full-stack development'
    }
  ]
  // Add more fields as needed by your components
};

export default function ApplicantDetailsPage() {
  const { id } = useParams(); // Still use id for URL (e.g., /student/123)
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth) || {};
  const [student, setStudent] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasRequiredDocuments, setHasRequiredDocuments] = useState(false);
  const navigate = useNavigate();
  // Simulate loading mock data
  useEffect(() => {
    const loadMockData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStudent(mockStudent);
      setInitialLoading(false);
    };

    loadMockData();
  }, [id]);

  // Update hasRequiredDocuments when student changes
  useEffect(() => {
    if (student) {
      const requiredDocuments = ['work experience', 'qualification'];
      const hasDocs = requiredDocuments.some((type) =>
        student.documents?.some((doc: any) => doc.file_type === type)
      );
      setHasRequiredDocuments(hasDocs || student.noDocuments);
    }
  }, [student]);

  // Mock save handler
  const handleSave = async (data: any) => {
    console.log('Saving data (mock):', data);
    toast({
      title: 'Success',
      description: 'Changes saved locally (mock).',
      className: 'bg-theme text-white'
    });

    // Optionally update mock student
    setStudent((prev: any) => ({ ...prev, ...data }));
  };

  // Memoized completion checks
  // const isPersonalComplete = useMemo(() => isPersonalInfoComplete(student), [student]);
  // const isAcademicComplete = useMemo(() => isAcademicInfoComplete(student), [student]);
  // const isWorkExperience = useMemo(() => isWorkExperienceComplete(student), [student]);
  // const isComplete = useMemo(
  //   () => isStudentDataComplete(student, hasRequiredDocuments),
  //   [student, hasRequiredDocuments]
  // );

  const activeTabClass =
    'data-[state=active]:bg-theme data-[state=active]:text-white';

  // Define tabs
  const tabs = [
    { value: 'personal', label: 'Personal Details' },
    { value: 'education', label: 'Education' },

    { value: 'documents', label: 'Documents' }
  ];

  if (initialLoading) {
    return (
      <div className="flex justify-center py-6">
        <BlinkingDots size="large" color="bg-theme" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-end  py-3">
        {/* <h1 className="text-2xl font-semibold">View Student</h1> */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="border-none bg-theme text-white hover:bg-theme/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Button>

          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </header>

      <StudentProfile
        student={student}
        fetchStudent={() => setStudent(mockStudent)}
      />

      <Tabs defaultValue="personal" className="mt-1 px-2">
        <TabsList className="flex h-20 flex-wrap justify-start">
          {tabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className={activeTabClass}>
              {/* {<XCircle className="mr-2 h-4 w-4 text-red-600" />} */}
              <div className="p-4">{label}</div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsForm student={student} onSave={handleSave} />
          {/* <EmergencyContacts student={student} onSave={handleSave} /> */}
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsSection
            student={student}
            // fetchDocuments={() => {}}
            onSave={handleSave}
          />
        </TabsContent>
        <TabsContent value="education">
          <EducationSection student={student} onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
