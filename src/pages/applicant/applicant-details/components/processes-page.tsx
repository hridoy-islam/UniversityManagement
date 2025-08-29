import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Upload, FileText, AlertCircle, Download, BarChart2 } from "lucide-react"

interface DocumentRequirement {
  id: string
  name: string
  category: string
  required: boolean
  uploaded: boolean
  fileName?: string
  uploadDate?: string
  status: "pending" | "uploaded" | "verified" | "rejected"
}

interface ProcessesPageProps {
  student: any
  onSave: (data: any) => void
}

const mockDocumentRequirements: DocumentRequirement[] = [
  {
    id: "1",
    name: "Passport Copy",
    category: "Identity",
    required: true,
    uploaded: true,
    fileName: "passport_john_doe.pdf",
    uploadDate: "2024-01-15",
    status: "verified",
  },
  {
    id: "2",
    name: "Degree Certificate",
    category: "Academic",
    required: true,
    uploaded: true,
    fileName: "degree_certificate.pdf",
    uploadDate: "2024-01-14",
    status: "uploaded",
  },
  {
    id: "3",
    name: "English Proficiency Test",
    category: "Academic",
    required: true,
    uploaded: false,
    status: "pending",
  },
  {
    id: "4",
    name: "Financial Statement",
    category: "Financial",
    required: true,
    uploaded: true,
    fileName: "bank_statement.pdf",
    uploadDate: "2024-01-12",
    status: "rejected",
  },
  {
    id: "5",
    name: "Medical Certificate",
    category: "Health",
    required: false,
    uploaded: false,
    status: "pending",
  },
  {
    id: "6",
    name: "Work Experience Letter",
    category: "Professional",
    required: false,
    uploaded: true,
    fileName: "work_experience.pdf",
    uploadDate: "2024-01-10",
    status: "verified",
  },
]

export default function ProcessesPage({ student, onSave }: ProcessesPageProps) {
  const [documents] = useState<DocumentRequirement[]>(mockDocumentRequirements)

  const requiredDocuments = documents.filter((doc) => doc.required)
  const optionalDocuments = documents.filter((doc) => !doc.required)

  const uploadedRequired = requiredDocuments.filter((doc) => doc.uploaded).length
  const uploadedOptional = optionalDocuments.filter((doc) => doc.uploaded).length

  const totalRequired = requiredDocuments.length
  const totalOptional = optionalDocuments.length

  const completionPercentage = totalRequired > 0 ? (uploadedRequired / totalRequired) * 100 : 100

  const getStatusIcon = (status: string, uploaded: boolean) => {
    if (!uploaded) return <Clock className="h-4 w-4 text-yellow-600" />

    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "uploaded":
        return <Upload className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string, uploaded: boolean) => {
    if (!uploaded) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Pending
        </Badge>
      )
    }

    const variants = {
      verified: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      uploaded: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
    }

    const labels = {
      verified: "Verified",
      rejected: "Rejected",
      uploaded: "Under Review",
      pending: "Pending",
    }

    return <Badge className={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const DocumentCard = ({ doc }: { doc: DocumentRequirement }) => (
    <Card key={doc.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(doc.status, doc.uploaded)}
            <div>
              <h4 className="font-medium">{doc.name}</h4>
              <p className="text-sm text-muted-foreground">{doc.category}</p>
              {doc.uploaded && doc.fileName && (
                <p className="text-xs text-muted-foreground mt-1">
                  File: {doc.fileName} • Uploaded: {doc.uploadDate}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(doc.status, doc.uploaded)}
            {doc.uploaded && (
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {doc.status === "rejected" && (
          <div className="mt-3 p-2 bg-red-50 rounded-md flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Document rejected</p>
              <p>Please upload a clearer copy or contact support for assistance.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

 return (
  <div className="space-y-8">
    {/* Overview Cards - KPI Summary */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Required Documents Card */}
      <Card className="shadow-sm border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-blue-600" />
            Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{uploadedRequired}</span>
            <span className="text-sm text-gray-500">/ {totalRequired}</span>
          </div>
          <Progress value={completionPercentage} className="mt-3 bg-gray-200" />
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round(completionPercentage)}% completed
          </p>
        </CardContent>
      </Card>

      {/* Optional Documents Card */}
      <Card className="shadow-sm border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
            <FileText className="h-4 w-4 mr-2 text-green-600" />
            Optional Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{uploadedOptional}</span>
            <span className="text-sm text-gray-500">/ {totalOptional}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Additional materials submitted
          </p>
        </CardContent>
      </Card>

      {/* Overall Status Card */}
      <Card className="shadow-sm border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
            <BarChart2 className="h-4 w-4 mr-2 text-purple-600" />
            Submission Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {completionPercentage === 100 ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Complete</span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">In Progress</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {completionPercentage === 100
              ? 'All required documents have been submitted.'
              : `${totalRequired - uploadedRequired} required document(s) remaining.`}
          </p>
        </CardContent>
      </Card>
    </div>

    {/* Required Documents Section */}
    <Card className="border-t-4 border-t-red-500 shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Required Documents
            </CardTitle>
          </div>
          <Badge variant="destructive" className="text-xs px-2.5 py-1">
            {totalRequired - uploadedRequired} Missing
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {requiredDocuments.length > 0 ? (
          requiredDocuments.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        ) : (
          <p className="text-sm text-muted-foreground italic">No required documents to show.</p>
        )}
      </CardContent>
    </Card>

    {/* Optional Documents Section */}
    <Card className="border-t-4 border-t-blue-500 shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-gray-800">
              Optional Documents
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs px-2.5 py-1">
            {uploadedOptional} Uploaded
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {optionalDocuments.length > 0 ? (
          optionalDocuments.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        ) : (
          <p className="text-sm text-muted-foreground italic">No optional documents uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  </div>
);
}
