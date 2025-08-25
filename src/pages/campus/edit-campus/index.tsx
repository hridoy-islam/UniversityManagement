import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import Select from "react-select"

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "bd", label: "Bangladesh" },
]

const timezoneOptions = [
  { value: "utc", label: "UTC" },
  { value: "est", label: "EST (GMT-5)" },
  { value: "bst", label: "BST (GMT+6)" },
]

const currencyOptions = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "bdt", label: "BDT - Bangladeshi Taka" },
]

const contactPersonOptions = [
  { value: "john", label: "John Smith" },
  { value: "sarah", label: "Sarah Johnson" },
  { value: "michael", label: "Michael Brown" },
]

export default function EditCampusPage() {
  const navigate = useNavigate()
  const { id } = useParams() // e.g. /campus/edit/:id

  const [formData, setFormData] = useState({
    campusName: "",
    addressLine1: "",
    addressLine2: "",
    college: "",
    country: "",
    timezone: "",
    currency: "",
    notificationEmail: "",
    contactPerson: "",
    logo: "" as File | string | null,
  })

  // Fetch campus data when editing
  useEffect(() => {
    if (id) {
      // Replace this with API call to fetch campus details
      const mockCampus = {
        campusName: "Watney College",
        addressLine1: "123 Nelson Street",
        addressLine2: "Near Central Park",
        college: "Watney Group",
        country: "uk",
        timezone: "utc",
        currency: "gbp",
        notificationEmail: "admin@watney.ac.uk",
        contactPerson: "john",
        logo: "",
      }
      setFormData(mockCampus)
    }
  }, [id])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Replace with API update logic
    console.log("Updated Campus Data:", formData)
    navigate(-1)
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-theme text-white hover:bg-theme/90"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Edit Campus</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update campus information and details
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campus Name */}
              <div className="space-y-1">
                <Label htmlFor="campusName">Campus Name</Label>
                <Input
                  id="campusName"
                  placeholder="Enter campus name"
                  value={formData.campusName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, campusName: e.target.value }))
                  }
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* College */}
              <div className="space-y-1">
                <Label>College</Label>
                <Input
                  id="college"
                  placeholder="Enter college"
                  value={formData.college}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, college: e.target.value }))
                  }
                  className="text-xs h-8"
                />
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <Label htmlFor="address1">Address Line 1</Label>
                <Input
                  id="address1"
                  placeholder="Enter address line 1"
                  value={formData.addressLine1}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))
                  }
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  placeholder="Enter address line 2"
                  value={formData.addressLine2}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, addressLine2: e.target.value }))
                  }
                  className="text-xs h-8"
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <Label>Country</Label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find((opt) => opt.value === formData.country) || null}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, country: val ? val.value : "" }))
                  }
                  placeholder="Select country"
                  className="text-xs"
                />
              </div>

              {/* Timezone */}
              <div className="space-y-1">
                <Label>Timezone</Label>
                <Select
                  options={timezoneOptions}
                  value={timezoneOptions.find((opt) => opt.value === formData.timezone) || null}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, timezone: val ? val.value : "" }))
                  }
                  placeholder="Select timezone"
                  className="text-xs"
                />
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <Label>Currency</Label>
                <Select
                  options={currencyOptions}
                  value={currencyOptions.find((opt) => opt.value === formData.currency) || null}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, currency: val ? val.value : "" }))
                  }
                  placeholder="Select currency"
                  className="text-xs"
                />
              </div>

              {/* Notification Email */}
              <div className="space-y-1">
                <Label htmlFor="notificationEmail">Notification Email</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="Enter notification email"
                  value={formData.notificationEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notificationEmail: e.target.value }))
                  }
                  required
                  className="text-xs h-8"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-1">
                <Label>Contact Person</Label>
                <Select
                  options={contactPersonOptions}
                  value={
                    contactPersonOptions.find((opt) => opt.value === formData.contactPerson) || null
                  }
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, contactPerson: val ? val.value : "" }))
                  }
                  placeholder="Select contact person"
                  className="text-xs"
                />
              </div>

              {/* Logo */}
              <div className="space-y-1">
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs h-8"
                />
                {formData.logo && typeof formData.logo !== "string" && (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Preview"
                    className="h-12 w-12 object-cover mt-2 rounded-md border"
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90"
              >
                Update Campus
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
