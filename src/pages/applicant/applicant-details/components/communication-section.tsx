import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Mail, FileText, Send, Search, Filter, Eye, Download } from "lucide-react"

interface CommunicationLog {
  id: string
  type: "letter" | "email"
  subject: string
  template: string
  recipient: string
  sentDate: string
  status: "sent" | "delivered" | "opened" | "failed"
}

interface CommunicationPageProps {
  student: any
  onSave: (data: any) => void
}

const emailTemplates = [
  { id: "welcome", name: "Welcome Email", type: "email" },
  { id: "interview", name: "Interview Invitation", type: "email" },
  { id: "acceptance", name: "Application Acceptance", type: "email" },
  { id: "rejection", name: "Application Rejection", type: "email" },
]

const letterTemplates = [
  { id: "offer", name: "Offer Letter", type: "letter" },
  { id: "visa", name: "Visa Support Letter", type: "letter" },
  { id: "enrollment", name: "Enrollment Confirmation", type: "letter" },
  { id: "reference", name: "Reference Letter", type: "letter" },
]

const mockCommunicationLog: CommunicationLog[] = [
  {
    id: "1",
    type: "email",
    subject: "Welcome to Our Program",
    template: "Welcome Email",
    recipient: "john.doe@example.com",
    sentDate: "2024-01-15",
    status: "opened",
  },
  {
    id: "2",
    type: "letter",
    subject: "Offer Letter",
    template: "Offer Letter",
    recipient: "John Doe",
    sentDate: "2024-01-10",
    status: "delivered",
  },
]

export default function CommunicationPage({ student, onSave }: CommunicationPageProps) {
  const [communicationLog, setCommunicationLog] = useState<CommunicationLog[]>(mockCommunicationLog)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [isLetterDialogOpen, setIsLetterDialogOpen] = useState(false)
  const [emailForm, setEmailForm] = useState({
    template: "",
    subject: "",
    recipient: student?.email || "",
    message: "",
  })
  const [letterForm, setLetterForm] = useState({
    template: "",
    subject: "",
    recipient: `${student?.firstName} ${student?.lastName}` || "",
    content: "",
  })

  const filteredLog = communicationLog.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.template.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSendEmail = () => {
    const newEmail: CommunicationLog = {
      id: Date.now().toString(),
      type: "email",
      subject: emailForm.subject,
      template: emailTemplates.find((t) => t.id === emailForm.template)?.name || "",
      recipient: emailForm.recipient,
      sentDate: new Date().toISOString().split("T")[0],
      status: "sent",
    }

    setCommunicationLog((prev) => [newEmail, ...prev])
    setIsEmailDialogOpen(false)
    setEmailForm({ template: "", subject: "", recipient: student?.email || "", message: "" })
  }

  const handleSendLetter = () => {
    const newLetter: CommunicationLog = {
      id: Date.now().toString(),
      type: "letter",
      subject: letterForm.subject,
      template: letterTemplates.find((t) => t.id === letterForm.template)?.name || "",
      recipient: letterForm.recipient,
      sentDate: new Date().toISOString().split("T")[0],
      status: "sent",
    }

    setCommunicationLog((prev) => [newLetter, ...prev])
    setIsLetterDialogOpen(false)
    setLetterForm({
      template: "",
      subject: "",
      recipient: `${student?.firstName} ${student?.lastName}` || "",
      content: "",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      opened: "bg-purple-100 text-purple-800",
      failed: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Dialog open={isLetterDialogOpen} onOpenChange={setIsLetterDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-theme hover:bg-theme text-white">
              <FileText className="mr-2 h-4 w-4" />
              Send New Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Letter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="letter-template">Choose Template</Label>
                <Select
                  value={letterForm.template}
                  onValueChange={(value) => setLetterForm((prev) => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a letter template" />
                  </SelectTrigger>
                  <SelectContent>
                    {letterTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="letter-subject">Subject</Label>
                <Input
                  id="letter-subject"
                  value={letterForm.subject}
                  onChange={(e) => setLetterForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter letter subject"
                />
              </div>
              <div>
                <Label htmlFor="letter-recipient">Recipient</Label>
                <Input
                  id="letter-recipient"
                  value={letterForm.recipient}
                  onChange={(e) => setLetterForm((prev) => ({ ...prev, recipient: e.target.value }))}
                  placeholder="Enter recipient name"
                />
              </div>
              <div>
                <Label htmlFor="letter-content">Content</Label>
                <Textarea
                  id="letter-content"
                  value={letterForm.content}
                  onChange={(e) => setLetterForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter letter content"
                  rows={6}
                />
              </div>
                 <div className="flex justify-end">

              <Button onClick={handleSendLetter} >
                <Send className="mr-2 h-4 w-4" />
                Send Letter
              </Button>
                 </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-theme hover:bg-theme text-white">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-template">Choose Template</Label>
                <Select
                  value={emailForm.template}
                  onValueChange={(value) => setEmailForm((prev) => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
             
              <div>
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter email message"
                  rows={6}
                />
              </div>
              <div className="flex justify-end">

              <Button onClick={handleSendEmail} >
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Communication Log */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Log</CardTitle>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search communications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No communications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLog.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {item.type === "email" ? (
                          <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2 text-green-600" />
                        )}
                        {item.type}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.subject}</TableCell>
                    <TableCell>{item.template}</TableCell>
                    <TableCell>{item.recipient}</TableCell>
                    <TableCell>{item.sentDate}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
