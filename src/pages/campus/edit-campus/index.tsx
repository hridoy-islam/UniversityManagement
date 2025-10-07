import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const countryOptions = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "bd", label: "Bangladesh" },
];

const timezoneOptions = [
  { value: "utc", label: "UTC" },
  { value: "est", label: "EST (GMT-5)" },
  { value: "bst", label: "BST (GMT+6)" },
];

const currencyOptions = [
  { value: "usd", label: "USD - US Dollar" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "bdt", label: "BDT - Bangladeshi Taka" },
];

const contactPersonOptions = [
  { value: "john", label: "John Smith" },
  { value: "sarah", label: "Sarah Johnson" },
  { value: "michael", label: "Michael Brown" },
];

export default function EditCampusPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
    logo: "" as string | null, // logo stored as URL string
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch campus data
  useEffect(() => {
    const fetchCampus = async () => {
      if (!id) return;
      try {
        const res = await axiosInstance.get(`/campuses/${id}`);
        const campus = res.data.data; // adjust if your API structure differs
        setFormData({
          campusName: campus.campusName || "",
          addressLine1: campus.addressLine1 || "",
          addressLine2: campus.addressLine2 || "",
          college: campus.college || "",
          country: campus.country || "",
          timezone: campus.timezone || "",
          currency: campus.currency || "",
          notificationEmail: campus.notificationEmail || "",
          contactPerson: campus.contactPerson || "",
          logo: campus.logo || null,
        });
      } catch (error) {
        console.error("Failed to fetch campus:", error);
        toast.error("Failed to load campus data.");
      } finally {
        setLoading(false);
      }
    };
    fetchCampus();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    try {
      // JSON payload
      const payload = {
        campusName: formData.campusName,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        college: formData.college,
        country: formData.country,
        timezone: formData.timezone,
        currency: formData.currency,
        notificationEmail: formData.notificationEmail,
        contactPerson: formData.contactPerson,
        logo: formData.logo, // already URL string
      };

      await axiosInstance.patch(`/campuses/${id}`, payload);

      toast.success("Campus updated successfully!");
      navigate(-1);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update campus.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-xs text-center mt-4">Loading campus data...</p>;

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
              <div className="space-y-1">
                <Label>Campus Name</Label>
                <Input
                  value={formData.campusName}
                  onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                  required
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label>College</Label>
                <Input
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label>Address Line 1</Label>
                <Input
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  required
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label>Address Line 2</Label>
                <Input
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label>Country</Label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find((opt) => opt.value === formData.country) || null}
                  onChange={(val) => setFormData({ ...formData, country: val?.value || "" })}
                  placeholder="Select country"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label>Timezone</Label>
                <Select
                  options={timezoneOptions}
                  value={timezoneOptions.find((opt) => opt.value === formData.timezone) || null}
                  onChange={(val) => setFormData({ ...formData, timezone: val?.value || "" })}
                  placeholder="Select timezone"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label>Currency</Label>
                <Select
                  options={currencyOptions}
                  value={currencyOptions.find((opt) => opt.value === formData.currency) || null}
                  onChange={(val) => setFormData({ ...formData, currency: val?.value || "" })}
                  placeholder="Select currency"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label>Notification Email</Label>
                <Input
                  type="email"
                  value={formData.notificationEmail}
                  onChange={(e) => setFormData({ ...formData, notificationEmail: e.target.value })}
                  required
                  className="text-xs h-8"
                />
              </div>

              <div className="space-y-1">
                <Label>Contact Person</Label>
                <Select
                  options={contactPersonOptions}
                  value={contactPersonOptions.find((opt) => opt.value === formData.contactPerson) || null}
                  onChange={(val) => setFormData({ ...formData, contactPerson: val?.value || "" })}
                  placeholder="Select contact person"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={submitting} className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90">
                {submitting ? "Updating..." : "Update Campus"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
