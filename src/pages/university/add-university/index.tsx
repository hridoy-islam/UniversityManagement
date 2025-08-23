import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AddUniversityPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    established: "",
    country: "",
    website: "",
    status: "Active"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.abbreviation || !formData.established || !formData.country) {
      alert("Please fill in all required fields.");
      return;
    }

    // Simulate API call
    console.log("New University Data:", formData);

    // Here you would typically dispatch to Redux or call an API
    // await dispatch(addUniversity(formData)) or axios.post(...)

    // After success
    navigate("/universities"); // Redirect to university list
  };

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
              <CardTitle className="text-2xl font-bold">Add New University</CardTitle>
              <CardDescription className="text-xs mt-1">
                Enter the details of the new university to register it in the system
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

         
           

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="h-8 px-6 bg-theme text-white hover:bg-theme/90"
              >
                Add University
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}