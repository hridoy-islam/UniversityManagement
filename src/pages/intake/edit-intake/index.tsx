import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

// Mock data for campuses and their courses
const campusData = {
  "watney-college": {
    name: "Watney College, Nelson Street",
    courses: [
      "Entry Level Certificate in ESOL International All Modes (Entry 3)",
      "Focus Awards Level 3 Diploma in Business Administration",
      "ESB Level 2 Certificate in ESOL Skills for Life",
      "Level 2 Adult Social Care Certificate",
      "Level 4 Diploma in Adult Care",
    ],
  },
  "downtown-campus": {
    name: "Downtown Campus",
    courses: [
      "ESB Level 2 Certificate in ESOL Skills for Life",
      "Level 2 Adult Social Care Certificate",
      "Level 4 Diploma in Adult Care",
      "Certificate in Digital Marketing",
      "Diploma in Project Management",
    ],
  },
  "north-campus": {
    name: "North Campus",
    courses: [
      "Entry Level Certificate in ESOL International All Modes (Entry 3)",
      "Focus Awards Level 3 Diploma in Business Administration",
      "Certificate in Healthcare Support",
      "Diploma in Early Childhood Education",
    ],
  },
}

// Mock existing intakes
const mockIntakes = [
  {
    id: "1",
    intakeName: "January 2025 Intake",
    validTill: "2025-01-30",
    campus: "watney-college",
    selectedCourses: [
      "Focus Awards Level 3 Diploma in Business Administration",
      "Level 4 Diploma in Adult Care",
    ],
  },
  {
    id: "2",
    intakeName: "Spring 2025",
    validTill: "2025-04-15",
    campus: "downtown-campus",
    selectedCourses: ["Diploma in Project Management"],
  },
]

export default function EditIntakePage() {
  const { id } = useParams() // intake id from route
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    intakeName: "",
    validTill: "",
    campus: "",
    selectedCourses: [] as string[],
  })

  useEffect(() => {
    // Load intake by ID (mock fetch)
    const intake = mockIntakes.find((i) => i.id === id)
    if (intake) setFormData(intake)
  }, [id])

  const handleCampusChange = (campus: string) => {
    setFormData((prev) => ({
      ...prev,
      campus,
      selectedCourses: [], // reset courses if campus changes
    }))
  }

  const handleCourseToggle = (course: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(course)
        ? prev.selectedCourses.filter((c) => c !== course)
        : [...prev.selectedCourses, course],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated intake:", formData)
    navigate(-1)
  }

  const selectedCampusData = formData.campus
    ? campusData[formData.campus as keyof typeof campusData]
    : null

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
              <CardTitle className="text-2xl font-bold">Edit Intake</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update the intake details, campus, and course selections
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Intake Name */}
              <div className="space-y-1">
                <Label htmlFor="intakeName" className="text-xs font-medium">Intake Name</Label>
                <Input
                  id="intakeName"
                  value={formData.intakeName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, intakeName: e.target.value }))}
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Available Till */}
              <div className="space-y-1">
                <Label htmlFor="validTill" className="text-xs font-medium">Available till date</Label>
                <div className="relative">
                  <Input
                    id="validTill"
                    type="date"
                    value={formData.validTill}
                    onChange={(e) => setFormData((prev) => ({ ...prev, validTill: e.target.value }))}
                    required
                    className="text-xs h-8 pl-3 pr-8"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Campus */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Campus</Label>
                <Select value={formData.campus} onValueChange={handleCampusChange} required>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(campusData).map(([key, campus]) => (
                      <SelectItem key={key} value={key} className="text-xs">
                        {campus.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Courses */}
            {selectedCampusData && (
              <div className="space-y-3">
                <Label className="text-xs font-medium">Select Courses</Label>
                <Card className="p-3">
                  <h4 className="font-medium text-xs text-primary mb-2">{selectedCampusData.name}</h4>
                  <div className="space-y-2">
                    {selectedCampusData.courses.map((course) => (
                      <div key={course} className="flex items-start space-x-2">
                        <Checkbox
                          id={course}
                          checked={formData.selectedCourses.includes(course)}
                          onCheckedChange={() => handleCourseToggle(course)}
                          className="mt-0.5"
                        />
                        <Label htmlFor={course} className="text-xs leading-4 cursor-pointer">
                          {course}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Save Button */}
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
