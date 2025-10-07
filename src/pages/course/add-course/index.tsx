import React, { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

// Mock data: Universities → Campuses
const universityData = {
  'university-of-manchester': {
    name: 'University of Manchester',
    campuses: {
      'main-campus': { name: 'Main Campus', location: 'Manchester, UK' },
      'east-campus': { name: 'East Campus', location: 'Greater Manchester' },
    },
  },
  'london-school-of-economics': {
    name: 'London School of Economics',
    campuses: {
      'london-central': { name: 'Central Campus', location: 'London, UK' },
      'north-campus': { name: 'North Campus', location: 'Hampstead, London' },
    },
  },
  'university-of-birmingham': {
    name: 'University of Birmingham',
    campuses: {
      edgbaston: { name: 'Edgbaston Campus', location: 'Birmingham, UK' },
      'city-center': { name: 'City Center Hub', location: 'Birmingham City' },
    },
  },
};

export default function AddCoursePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    university: '',
    campus: '',
    courseName: '',
    coverPdf: ''
  });

  const selectedUniversity = formData.university
    ? universityData[formData.university as keyof typeof universityData]
    : null;

  const campusOptions = selectedUniversity
    ? Object.entries(selectedUniversity.campuses).map(([key, campus]) => ({
        value: key,
        label: `${campus.name} — ${campus.location}`
      }))
    : [];

  const handleUniversityChange = (selected: { value: string; label: string } | null) => {
    setFormData(prev => ({ ...prev, university: selected?.value || '', campus: '' }));
  };

  const handleCampusChange = (selected: { value: string; label: string } | null) => {
    setFormData(prev => ({ ...prev, campus: selected?.value || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.university || !formData.campus || !formData.courseName) return;

    const payload = {
      university: formData.university,
      campus: formData.campus,
      courseName: formData.courseName,
      coverPdf: formData.coverPdf || null,
    };

    try {
      await axiosInstance.post('/course', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Course created successfully!');
      navigate(-1);
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const selectStyles = {
    control: (base: any) => ({ ...base, minHeight: '32px', height: '32px' }),
    valueContainer: (base: any) => ({ ...base, height: '32px', padding: '0 8px' }),
    indicatorsContainer: (base: any) => ({ ...base, height: '32px' }),
    singleValue: (base: any) => ({ ...base, fontSize: '12px' }),
    menu: (base: any) => ({ ...base, fontSize: '12px' }),
  };

  return (
    <div>
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
              <CardTitle className="text-2xl font-bold">Add New Course</CardTitle>
              <CardDescription className="mt-1 text-xs">
                Fill in the details to create a new course
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="university" className="text-xs font-medium">
                  University / Awarding Body
                </Label>
                <Select
                  options={Object.entries(universityData).map(([key, uni]) => ({
                    value: key,
                    label: uni.name
                  }))}
                  onChange={handleUniversityChange}
                  placeholder="Select university..."
                  styles={selectStyles}
                  isClearable
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="campus" className="text-xs font-medium">
                  Campus
                </Label>
                <Select
                  options={campusOptions}
                  onChange={handleCampusChange}
                  placeholder={selectedUniversity ? 'Select campus...' : 'Select university first'}
                  styles={selectStyles}
                  isDisabled={!selectedUniversity}
                  isClearable
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="courseName" className="text-xs font-medium">Course Name</Label>
              <Input
                id="courseName"
                placeholder="Enter course name"
                value={formData.courseName}
                onChange={e => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                required
                className="h-8"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="coverPdf" className="text-xs font-medium">Video URL (Optional)</Label>
              <Input
                id="coverPdf"
                placeholder="Enter video URL"
                value={formData.coverPdf}
                onChange={e => setFormData(prev => ({ ...prev, coverPdf: e.target.value }))}
                className="h-8"
              />
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="h-8 bg-theme px-6 text-white hover:bg-theme/90"
                disabled={!formData.courseName || !formData.university || !formData.campus}
              >
                Create Course
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
