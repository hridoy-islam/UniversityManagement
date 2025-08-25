import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Select from "react-select"
import { useParams, useNavigate } from "react-router-dom"

// Mock options
const universities = [
  { value: "uni-oxford", label: "Oxford University" },
  { value: "uni-cambridge", label: "Cambridge University" },
]

const campuses = [
  { value: "watney-college", label: "Watney College" },
  { value: "downtown-campus", label: "Downtown Campus" },
]

const roles = [
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
]

const titles = [
  { value: "mr", label: "Mr" },
  { value: "ms", label: "Ms" },
  { value: "mrs", label: "Mrs" },
  { value: "dr", label: "Dr" },
  { value: "prof", label: "Prof" },
]

// Mock staff data
const mockStaff = [
  {
    id: "1",
    university: "uni-oxford",
    campus: "watney-college",
    role: "teacher",
    title: "mr",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+12345678",
  },
  {
    id: "2",
    university: "uni-cambridge",
    campus: "downtown-campus",
    role: "admin",
    title: "ms",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice@example.com",
    phone: "+987654321",
  },
]

export default function EditStaffPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    university: "",
    campus: "",
    role: "",
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const staff = mockStaff.find((s) => s.id === id)
    if (staff) setFormData(staff)
  }, [id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated staff:", { ...formData, password: "123456" })
    navigate(-1)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)}>
              <Button variant="outline" size="sm" className="text-xs bg-theme text-white hover:bg-theme/90">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Edit Staff</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update staff details, role, and campus assignment
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University */}
              <div>
                <Label className="text-xs font-medium">University</Label>
                <Select
                  options={universities}
                  value={universities.find((u) => u.value === formData.university) || null}
                  onChange={(option) => setFormData((prev) => ({ ...prev, university: option?.value || "" }))}
                  placeholder="Select University"
                />
              </div>

              {/* Campus */}
              <div>
                <Label className="text-xs font-medium">College / Campus</Label>
                <Select
                  options={campuses}
                  value={campuses.find((c) => c.value === formData.campus) || null}
                  onChange={(option) => setFormData((prev) => ({ ...prev, campus: option?.value || "" }))}
                  placeholder="Select Campus"
                />
              </div>

              {/* Role */}
              <div>
                <Label className="text-xs font-medium">Role</Label>
                <Select
                  options={roles}
                  value={roles.find((r) => r.value === formData.role) || null}
                  onChange={(option) => setFormData((prev) => ({ ...prev, role: option?.value || "" }))}
                  placeholder="Select Role"
                />
              </div>

              {/* Title */}
              <div>
                <Label className="text-xs font-medium">Title</Label>
                <Select
                  options={titles}
                  value={titles.find((t) => t.value === formData.title) || null}
                  onChange={(option) => setFormData((prev) => ({ ...prev, title: option?.value || "" }))}
                  placeholder="Select Title"
                />
              </div>

              {/* First Name */}
              <div>
                <Label className="text-xs font-medium">First Name</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Last Name */}
              <div>
                <Label className="text-xs font-medium">Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-xs font-medium">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Phone */}
              <div>
                <Label className="text-xs font-medium">Phone</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                  className="text-xs h-8"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
