import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

// Mock database of universities
const mockUniversities = [
  {
    id: 1,
    name: "University of Manchester",
    abbreviation: "UoM",
    established: 1824,
    country: "United Kingdom",
    website: "https://www.manchester.ac.uk",
    status: "Active"
  },
  {
    id: 2,
    name: "London School of Economics",
    abbreviation: "LSE",
    established: 1895,
    country: "United Kingdom",
    website: "https://www.lse.ac.uk",
    status: "Active"
  },
  {
    id: 3,
    name: "University of Birmingham",
    abbreviation: "UoB",
    established: 1900,
    country: "United Kingdom",
    website: "https://www.birmingham.ac.uk",
    status: "Inactive"
  }
];

export default function EditUniversityPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get university ID from route
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    established: "",
    country: "",
    website: "",
    status: "Active" as const
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) {
      setError("Invalid university ID");
      setLoading(false);
      return;
    }

    // Simulate fetching university data
    const university = mockUniversities.find(u => u.id === numId);

    if (!university) {
      setError(`University with ID ${id} not found.`);
      setLoading(false);
      return;
    }

    setFormData({
      name: university.name,
      abbreviation: university.abbreviation,
      established: String(university.established),
      country: university.country,
      website: university.website || "",
      status: university.status
    });
    setLoading(false);
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.abbreviation || !formData.established || !formData.country) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(formData.established) < 1000 || Number(formData.established) > new Date().getFullYear()) {
      setError("Please enter a valid year.");
      return;
    }

    // Simulate API update
    console.log(`Updating University ID: ${id}`, formData);

    // In real app: dispatch or API call
    // await dispatch(updateUniversity({ id, data: formData }));

    // Navigate back
    navigate("/universities");
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        Loading university data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8"
            >
              ← Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8 bg-theme text-white hover:bg-theme/90"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold">Edit University</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update the information for this university
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* University Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-medium">
                University Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., University of Oxford"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-8"
              />
            </div>

            {/* Abbreviation & Established Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="abbreviation" className="text-xs font-medium">
                  Abbreviation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="abbreviation"
                  placeholder="e.g., UoX"
                  value={formData.abbreviation}
                  onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
                  required
                  className="h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="established" className="text-xs font-medium">
                  Established Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="established"
                  type="number"
                  placeholder="1824"
                  value={formData.established}
                  onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                  required
                  min="1000"
                  max={new Date().getFullYear()}
                  className="h-8"
                />
              </div>
            </div>

            {/* Country & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="country" className="text-xs font-medium">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="country"
                  placeholder="United Kingdom"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="h-8"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="website" className="text-xs font-medium">
                  Website URL
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.example.edu"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="h-8"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs font-medium">
                Status
              </Label>
              <Select onValueChange={(value: 'Active' | 'Inactive' | 'Pending') =>
                  setFormData({ ...formData, status: value })
                }
                defaultValue={formData.status}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active" className="text-xs">Active</SelectItem>
                  <SelectItem value="Inactive" className="text-xs">Inactive</SelectItem>
                  <SelectItem value="Pending" className="text-xs">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded bg-red-50 p-2 text-xs text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="h-8 px-6 bg-theme text-white hover:bg-theme/90"
              >
                Update University
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}