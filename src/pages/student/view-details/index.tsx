"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentProfile } from "./components/student-profile"
import { PersonalDetailsForm } from "./components/personal-details-form"
import { useNavigate, useParams } from "react-router-dom"

import { useToast } from "@/components/ui/use-toast"

import { useSelector } from "react-redux"
import { BlinkingDots } from "@/components/shared/blinking-dots"
import NotePage from "./components/note-page"
import { CourseDetails } from "./components/course/course-details"
import { Attendance } from "./components/course/attendance"
import { Result } from "./components/course/result"
import { SLCHistory } from "./components/course/slc-history"
import { Accounts } from "./components/course/accounts"

// Mock Student Data
const mockStudent = {
  id: "123",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+44 7123 456789",
  dateOfBirth: "1995-06-15",
  nationality: "British",
  address: "123 Main St, London, UK",
  agent: "agent123",
  noDocuments: false,
  documents: [
    { file_type: "qualification", name: "Degree Certificate", url: "#" },
    { file_type: "work experience", name: "Employment Letter", url: "#" },
  ],
  education: [
    {
      institution: "University of London",
      degree: "BSc Computer Science",
      startDate: "2013-09-01",
      endDate: "2017-06-30",
    },
  ],
  workExperience: [
    {
      company: "TechCorp Ltd",
      role: "Software Developer",
      startDate: "2017-07-01",
      endDate: "2020-08-31",
      description: "Full-stack development",
    },
  ],
  // Add more fields as needed by your components
}

export default function StudentViewPage() {
  const { id } = useParams() // Still use id for URL (e.g., /student/123)
  const { toast } = useToast()
  const { user } = useSelector((state: any) => state.auth) || {}
  const [student, setStudent] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [hasRequiredDocuments, setHasRequiredDocuments] = useState(false)
  const navigate = useNavigate()
  // Simulate loading mock data
  useEffect(() => {
    const loadMockData = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      setStudent(mockStudent)
      setInitialLoading(false)
    }

    loadMockData()
  }, [id])

  // Update hasRequiredDocuments when student changes
  useEffect(() => {
    if (student) {
      const requiredDocuments = ["work experience", "qualification"]
      const hasDocs = requiredDocuments.some((type) => student.documents?.some((doc: any) => doc.file_type === type))
      setHasRequiredDocuments(hasDocs || student.noDocuments)
    }
  }, [student])

  // Mock save handler
  const handleSave = async (data: any) => {
    console.log("Saving data (mock):", data)
    toast({
      title: "Success",
      description: "Changes saved locally (mock).",
      className: "bg-theme text-white",
    })

    // Optionally update mock student
    setStudent((prev: any) => ({ ...prev, ...data }))
  }

  const activeTabClass = "data-[state=active]:bg-theme data-[state=active]:text-white"

  // Define tabs
  const tabs = [
    { value: "personal", label: "Profile" },
    { value: "course", label: "Course" },
    { value: "notes", label: "Notes" },
    { value: "task", label: "Task & Process" },
    { value: "dataFuture", label: "Datafuture" },
  ]

  if (initialLoading) {
    return (
      <div className="flex justify-center py-6">
        <BlinkingDots size="large" color="bg-theme" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-end">
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

      <StudentProfile student={student} fetchStudent={() => setStudent(mockStudent)} />

      <Tabs defaultValue="personal" className="mt-1 ">
        <TabsList className="flex flex-wrap justify-start">
          {tabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className={activeTabClass}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="personal">
          <PersonalDetailsForm student={student} onSave={handleSave} />
        </TabsContent>

        <TabsContent value="course">
          <Tabs defaultValue="course-details" className="mt-4">
            <TabsList className="flex  flex-wrap justify-start border  border-gray-200 bg-theme/10">
              <TabsTrigger value="course-details" className={activeTabClass}>
                Course Details
              </TabsTrigger>
              <TabsTrigger value="attendance" className={activeTabClass}>
                Attendance
              </TabsTrigger>
              <TabsTrigger value="result" className={activeTabClass}>
                Result
              </TabsTrigger>
              <TabsTrigger value="slc-history" className={activeTabClass}>
                SLC History
              </TabsTrigger>
              <TabsTrigger value="accounts" className={activeTabClass}>
                Accounts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="course-details">
              <CourseDetails student={student} />
            </TabsContent>

            <TabsContent value="attendance">
              <Attendance student={student} />
            </TabsContent>

            <TabsContent value="result">
              <Result student={student} />
            </TabsContent>

            <TabsContent value="slc-history">
              <SLCHistory student={student} />
            </TabsContent>

            <TabsContent value="accounts">
              <Accounts student={student} />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="notes">
          <NotePage student={student} onSave={handleSave} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
