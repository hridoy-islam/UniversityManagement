import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select, { SingleValue } from "react-select";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner"; // or your preferred toast lib
import * as z from "zod";

// Define option types
type OptionType = { value: string; label: string };

// Validation schema
const campusSchema = z.object({
  campusName: z.string().min(1, "Campus name is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  college: z.string().optional(),
  country: z.string().optional(), // We'll store value only
  timezone: z.string().optional(),
  currency: z.string().optional(),
  notificationEmail: z.string().email("Invalid email address"),
  contactPerson: z.string().optional(),
  logo: z.instanceof(File).optional(),
});

export type CampusFormData = z.infer<typeof campusSchema>;

const countryOptions: OptionType[] = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "bd", label: "Bangladesh" },
];

const timezoneOptions: OptionType[] = [
  { value: "utc", label: "UTC" },
  { value: "est", label: "EST (GMT-5)" },
  { value: "bst", label: "BST (GMT+6)" },
];

const currencyOptions: OptionType[] = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "bdt", label: "BDT - Bangladeshi Taka" },
];

const contactPersonOptions: OptionType[] = [
  { value: "john", label: "John Smith" },
  { value: "sarah", label: "Sarah Johnson" },
  { value: "michael", label: "Michael Brown" },
];

export default function AddCampusPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CampusFormData, string>>>({});

  // Initialize form state with `undefined` for optional fields
  const [formData, setFormData] = useState<{
    campusName: string;
    addressLine1: string;
    addressLine2: string | undefined;
    college: string | undefined;
    country: OptionType | undefined;
    timezone: OptionType | undefined;
    currency: OptionType | undefined;
    notificationEmail: string;
    contactPerson: OptionType | undefined;
    logo: File | undefined;
  }>({
    campusName: "",
    addressLine1: "",
    addressLine2: undefined,
    college: undefined,
    country: undefined,
    timezone: undefined,
    currency: undefined,
    notificationEmail: "",
    contactPerson: undefined,
    logo: undefined,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, logo: e.target.files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, logo: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare data for validation (extract .value from options)
    const validationData: CampusFormData = {
      campusName: formData.campusName,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      college: formData.college,
      country: formData.country?.value,
      timezone: formData.timezone?.value,
      currency: formData.currency?.value,
      notificationEmail: formData.notificationEmail,
      contactPerson: formData.contactPerson?.value,
      logo: formData.logo,
    };

    // Validate with Zod
    const result = campusSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CampusFormData, string>> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof CampusFormData] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the form errors.");
      return;
    }

    setIsSubmitting(true);

    try {


      await axiosInstance.post("/campuses", {
        campusName: formData.campusName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        college: formData.college,
        country: formData.country?.value,
        timezone: formData.timezone?.value,
        currency: formData.currency?.value,
        notificationEmail: formData.notificationEmail,
        contactPerson: formData.contactPerson?.value,
      });


      toast.success("Campus created successfully!");
      navigate(-1);
    } catch (error: any) {
      console.error("Submission error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create campus. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs bg-theme text-white hover:bg-theme/90"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold">Add New Campus</CardTitle>
              <CardDescription className="text-xs mt-1">
                Create a new campus with address, contact, and other details
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campus Name */}
              <div className="space-y-1">
                <Label htmlFor="campusName">Campus Name *</Label>
                <Input
                  id="campusName"
                  placeholder="Enter campus name"
                  value={formData.campusName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, campusName: e.target.value }))}
                  className="text-xs h-8"
                />
                {errors.campusName && <p className="text-red-500 text-xs">{errors.campusName}</p>}
              </div>

              {/* College */}
              <div className="space-y-1">
                <Label htmlFor="college">College</Label>
                <Input
                  id="college"
                  placeholder="Enter college name"
                  value={formData.college || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, college: e.target.value || undefined }))
                  }
                  className="text-xs h-8"
                />
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <Label htmlFor="address1">Address Line 1 *</Label>
                <Input
                  id="address1"
                  placeholder="Enter address line 1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, addressLine1: e.target.value }))}
                  className="text-xs h-8"
                />
                {errors.addressLine1 && (
                  <p className="text-red-500 text-xs">{errors.addressLine1}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input
                  id="address2"
                  placeholder="Enter address line 2"
                  value={formData.addressLine2 || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, addressLine2: e.target.value || undefined }))
                  }
                  className="text-xs h-8"
                />
              </div>

              {/* Country */}
              <div className="space-y-1">
                <Label>Country</Label>
                <Select<OptionType, false>
                  options={countryOptions}
                  value={formData.country || null}
                  onChange={(val: SingleValue<OptionType>) =>
                    setFormData((prev) => ({ ...prev, country: val || undefined }))
                  }
                  placeholder="Select country"
                  className="text-xs"
                />
              </div>

              {/* Timezone */}
              <div className="space-y-1">
                <Label>Timezone</Label>
                <Select<OptionType, false>
                  options={timezoneOptions}
                  value={formData.timezone || null}
                  onChange={(val: SingleValue<OptionType>) =>
                    setFormData((prev) => ({ ...prev, timezone: val || undefined }))
                  }
                  placeholder="Select timezone"
                  className="text-xs"
                />
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <Label>Currency</Label>
                <Select<OptionType, false>
                  options={currencyOptions}
                  value={formData.currency || null}
                  onChange={(val: SingleValue<OptionType>) =>
                    setFormData((prev) => ({ ...prev, currency: val || undefined }))
                  }
                  placeholder="Select currency"
                  className="text-xs"
                />
              </div>

              {/* Notification Email */}
              <div className="space-y-1">
                <Label htmlFor="notificationEmail">Notification Email *</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="Enter notification email"
                  value={formData.notificationEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notificationEmail: e.target.value }))
                  }
                  className="text-xs h-8"
                />
                {errors.notificationEmail && (
                  <p className="text-red-500 text-xs">{errors.notificationEmail}</p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-1">
                <Label>Contact Person</Label>
                <Select<OptionType, false>
                  options={contactPersonOptions}
                  value={formData.contactPerson || null}
                  onChange={(val: SingleValue<OptionType>) =>
                    setFormData((prev) => ({ ...prev, contactPerson: val || undefined }))
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
                {formData.logo && (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Preview"
                    className="h-12 w-12 object-cover mt-2 rounded-md border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90"
              >
                {isSubmitting ? "Creating..." : "Create Campus"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}