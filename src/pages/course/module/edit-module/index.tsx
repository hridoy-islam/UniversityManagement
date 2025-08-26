import type React from 'react';
import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlinkingDots } from '@/components/shared/blinking-dots';

// Mock function to simulate fetching module data
// In real app: replace with API call like `getModuleById(id)`
const fetchModuleById = async (id: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - replace with real fetch
  return {
    id,
    moduleName: 'Introduction to React',
    moduleCode: 'REACT101',
    moduleDescription: 'Learn the fundamentals of React, including components, props, and state.'
  };
};

// Mock function to update module
const updateModule = async (id: string, data: any) => {
  console.log(`Updating module ${id}:`, data);
  // In real app: await api.put(`/modules/${id}`, data);
  return true;
};

export default function EditModulePage() {
  const {id, moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    moduleName: '',
    moduleCode: '',
    moduleDescription: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setError('Module ID is required');
      setLoading(false);
      return;
    }

    const loadModule = async () => {
      try {
        const data = await fetchModuleById(moduleId);
        setFormData({
          moduleName: data.moduleName,
          moduleCode: data.moduleCode,
          moduleDescription: data.moduleDescription
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load module');
        setLoading(false);
      }
    };

    loadModule();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.moduleName || !formData.moduleCode || !formData.moduleDescription) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await updateModule(moduleId!, formData);
      console.log('Module updated successfully');
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('Error updating module:', err);
      alert('Failed to update module. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <BlinkingDots size="large" color="bg-theme" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-red-500">{error}</p>
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
              className="bg-theme text-white hover:bg-theme/90"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <CardTitle className="text-2xl font-bold">Edit Module</CardTitle>
              <CardDescription className="mt-1 text-xs">
                Update the module details below.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Grid: Module Name and Code */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="moduleName" className="text-xs font-medium">
                  Module Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="moduleName"
                  placeholder="e.g. Advanced React Patterns"
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

              <div className="space-y-1">
                <Label htmlFor="moduleCode" className="text-xs font-medium">
                  Module Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="moduleCode"
                  placeholder="e.g. REACT201"
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
              <Label htmlFor="moduleDescription" className="text-xs font-medium">
                Module Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="moduleDescription"
                placeholder="Describe the content and learning outcomes..."
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

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-theme text-white hover:bg-theme/90 text-xs"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}