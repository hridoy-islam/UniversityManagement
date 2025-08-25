import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

// Import react-select
import SelectReact, { MultiValue, SingleValue } from "react-select"

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

// Mock course metadata (fee, typical duration, etc.)
const courseMetadata: Record<
  string,
  { fee: number; durationWeeks: number }
> = {
  "Entry Level Certificate in ESOL International All Modes (Entry 3)": {
    fee: 450,
    durationWeeks: 12,
  },
  "Focus Awards Level 3 Diploma in Business Administration": {
    fee: 1200,
    durationWeeks: 24,
  },
  "ESB Level 2 Certificate in ESOL Skills for Life": {
    fee: 600,
    durationWeeks: 16,
  },
  "Level 2 Adult Social Care Certificate": {
    fee: 800,
    durationWeeks: 20,
  },
  "Level 4 Diploma in Adult Care": {
    fee: 1500,
    durationWeeks: 36,
  },
  "Certificate in Digital Marketing": {
    fee: 1000,
    durationWeeks: 18,
  },
  "Diploma in Project Management": {
    fee: 1800,
    durationWeeks: 30,
  },
  "Certificate in Healthcare Support": {
    fee: 900,
    durationWeeks: 22,
  },
  "Diploma in Early Childhood Education": {
    fee: 1600,
    durationWeeks: 40,
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

// React Select Option Type
type CourseOption = {
  value: string
  label: string
}

export default function EditIntakePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    intakeName: "",
    validTill: "",
    campus: "",
    selectedCourses: [] as string[],
    courseDetails: {} as Record<
      string,
      { fee: number; startDate: string; endDate: string }
    >,
  })

  useEffect(() => {
    const intake = mockIntakes.find((i) => i.id === id)
    if (intake) {
      const courseDetails: Record<
        string,
        { fee: number; startDate: string; endDate: string }
      > = {}

      intake.selectedCourses.forEach((course) => {
        const meta = courseMetadata[course] || { fee: 0, durationWeeks: 12 }
        // Default start date: validTill + 1 week
        const startDate = new Date(intake.validTill)
        startDate.setDate(startDate.getDate() + 7)
        const endDate = new Date(startDate)
        endDate.setWeeks(endDate.getWeeks() + meta.durationWeeks)

        courseDetails[course] = {
          fee: meta.fee,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }
      })

      setFormData({
        intakeName: intake.intakeName,
        validTill: intake.validTill,
        campus: intake.campus,
        selectedCourses: intake.selectedCourses,
        courseDetails,
      })
    }
  }, [id])

  // Extend Date prototype to support weeks
  Date.prototype.setWeeks = function (weeks: number) {
    this.setDate(this.getDate() + weeks * 7)
  }
  Date.prototype.getWeeks = function () {
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    return Math.round(
      (this.getTime() - new Date().getTime()) / oneWeek
    )
  }

  const handleCampusChange = (campus: string) => {
    setFormData((prev) => ({
      ...prev,
      campus,
      selectedCourses: [],
      courseDetails: {},
    }))
  }

  const handleCourseChange = (
    selectedOptions: MultiValue<CourseOption> | SingleValue<CourseOption>
  ) => {
    const selected = (selectedOptions as MultiValue<CourseOption>) || []
    const courseNames = selected.map((opt) => opt.value)

    setFormData((prev) => {
      const updatedDetails = { ...prev.courseDetails }

      // Add new courses with default values
      courseNames.forEach((course) => {
        if (!updatedDetails[course]) {
          const meta = courseMetadata[course] || { fee: 0, durationWeeks: 12 }
          const startDate = new Date(prev.validTill || Date.now())
          startDate.setDate(startDate.getDate() + 7)
          const endDate = new Date(startDate)
          endDate.setWeeks(endDate.getWeeks() + meta.durationWeeks)

          updatedDetails[course] = {
            fee: meta.fee,
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
          }
        }
      })

      // Remove courses that are no longer selected
      Object.keys(updatedDetails).forEach((course) => {
        if (!courseNames.includes(course)) {
          delete updatedDetails[course]
        }
      })

      return {
        ...prev,
        selectedCourses: courseNames,
        courseDetails: updatedDetails,
      }
    })
  }

  const handleDetailChange = (
    course: string,
    field: "fee" | "startDate" | "endDate",
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      courseDetails: {
        ...prev.courseDetails,
        [course]: {
          ...prev.courseDetails[course],
          [field]: value,
        },
      },
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

  const courseOptions: CourseOption[] = selectedCampusData
    ? selectedCampusData.courses.map((course) => ({
        value: course,
        label: course,
      }))
    : []

  const selectedCourseOptions: CourseOption[] = formData.selectedCourses
    .map((course) => ({
      value: course,
      label: course,
    }))
    .filter((opt) => courseOptions.some((o) => o.value === opt.value))

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)} className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-theme text-white hover:bg-theme/90"
              >
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
                <Label htmlFor="intakeName" className="text-xs font-medium">
                  Intake Name
                </Label>
                <Input
                  id="intakeName"
                  value={formData.intakeName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      intakeName: e.target.value,
                    }))
                  }
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Available Till */}
              <div className="space-y-1">
                <Label htmlFor="validTill" className="text-xs font-medium">
                  Available till date
                </Label>
                <div className="relative">
                  <Input
                    id="validTill"
                    type="date"
                    value={formData.validTill}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        validTill: e.target.value,
                      }))
                    }
                    required
                    className="text-xs h-8 pl-3 pr-8"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Campus */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Campus</Label>
                <Select
                  value={formData.campus}
                  onValueChange={handleCampusChange}
                  required
                >
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

            {/* Course Multi-Select */}
            {selectedCampusData && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Select Courses</Label>
                <SelectReact
                  isMulti
                  options={courseOptions}
                  value={selectedCourseOptions}
                  onChange={handleCourseChange}
                  placeholder="Select courses..."
                  className="text-xs"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "32px",
                      fontSize: "12px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      padding: "0 8px",
                    }),
                    input: (base) => ({
                      ...base,
                      margin: 0,
                      padding: 0,
                    }),
                  }}
                />
              </div>
            )}

            {/* Selected Courses Table */}
            {formData.selectedCourses.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-medium mb-3">Course Details</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-xs">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-3 text-left">Course Name</th>
                        <th className="py-2 px-3 text-left">Course Fee (£)</th>
                        <th className="py-2 px-3 text-left">Start Date</th>
                        <th className="py-2 px-3 text-left">End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.selectedCourses.map((course) => {
                        const details = formData.courseDetails[course] || {
                          fee: 0,
                          startDate: "",
                          endDate: "",
                        }
                        return (
                          <tr key={course} className="border-t">
                            <td className="py-2 px-3">{course}</td>
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={details.fee}
                                onChange={(e) =>
                                  handleDetailChange(
                                    course,
                                    "fee",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-8 w-24"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="date"
                                value={details.startDate}
                                onChange={(e) =>
                                  handleDetailChange(
                                    course,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                className="h-8"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <Input
                                type="date"
                                value={details.endDate}
                                onChange={(e) =>
                                  handleDetailChange(
                                    course,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                className="h-8"
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}