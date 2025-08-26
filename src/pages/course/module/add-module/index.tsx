import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // For Module Details
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddModulePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    moduleName: '',
    moduleCode: '',
    moduleDescription: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.moduleName ||
      !formData.moduleCode ||
      !formData.moduleDescription
    ) {
      alert('Please fill in all fields.');
      return;
    }

    // In a real app: send to API
    console.log('New Module:', formData);

    // Navigate back after save
    navigate(-1);
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)} className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                className="bg-theme text-xs text-white hover:bg-theme/90"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>

            {/* Page Title & Description */}
            <div>
              <CardTitle className="text-2xl font-bold">
                Add New Module
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Create a new course module with name, code, and description.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Grid: Module Name and Code */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Module Name */}
              <div className="space-y-1">
                <Label htmlFor="moduleName" className="text-xs font-medium">
                  Module Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="moduleName"
                  placeholder="e.g. Introduction to React"
                  value={formData.moduleName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      moduleName: e.target.value
                    }))
                  }
                  required
                  className="h-8 text-xs"
                />
              </div>

              {/* Module Code */}
              <div className="space-y-1">
                <Label htmlFor="moduleCode" className="text-xs font-medium">
                  Module Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="moduleCode"
                  placeholder="e.g. REACT101"
                  value={formData.moduleCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      moduleCode: e.target.value
                    }))
                  }
                  required
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Module Description */}
            <div className="space-y-1">
              <Label
                htmlFor="moduleDescription"
                className="text-xs font-medium"
              >
                Module Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="moduleDescription"
                placeholder="Describe the content and learning outcomes of this module..."
                value={formData.moduleDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    moduleDescription: e.target.value
                  }))
                }
                required
                className="h-20 resize-none border-gray-300 text-xs"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="text-xs   text-white hover:bg-theme/90"
              >
                Create Module
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
