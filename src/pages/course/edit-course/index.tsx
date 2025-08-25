import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Mock data: Universities → Campuses
const universityData = {
  'university-of-manchester': {
    name: 'University of Manchester',
    campuses: {
      'main-campus': { name: 'Main Campus', location: 'Manchester, UK' },
      'east-campus': { name: 'East Campus', location: 'Greater Manchester' }
    }
  },
  'london-school-of-economics': {
    name: 'London School of Economics',
    campuses: {
      'london-central': { name: 'Central Campus', location: 'London, UK' },
      'north-campus': { name: 'North Campus', location: 'Hampstead, London' }
    }
  },
  'university-of-birmingham': {
    name: 'University of Birmingham',
    campuses: {
      'edgbaston': { name: 'Edgbaston Campus', location: 'Birmingham, UK' },
      'city-center': { name: 'City Center Hub', location: 'Birmingham City' }
    }
  }
};

// Mock API: Fetch existing course by ID
const fetchCourseById = (id: string) => {
  // Simulate API delay
  return {
    id,
    university: 'university-of-manchester',
    campus: 'main-campus',
    courseName: 'Advanced Data Science & Machine Learning',
    courseDescription:
      '<p>This course covers advanced topics in data science, including deep learning, NLP, and big data processing.</p>',
    learningOutcomes:
      '<ul><li>Build and train deep neural networks</li><li>Process and analyze large datasets</li><li>Deploy ML models in production</li></ul>',
    coverImage: '/mock-images/course-cover.jpg', // Simulated existing image
    coverPdf: '/mock-pdfs/syllabus.pdf',
    coverVideoUrl: 'https://www.youtube.com/watch?v=abc123xyz'
  };
};

export default function EditCoursePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get course ID from URL

  const [formData, setFormData] = useState({
    university: '',
    campus: '',
    courseName: '',
    courseDescription: '',
    learningOutcomes: '',
    coverImage: null as File | null,
    coverPdf: null as File | null,
    coverVideoUrl: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Course ID is missing');
      return;
    }

    // Simulate fetching course data
    const courseData = fetchCourseById(id);

    setFormData({
      university: courseData.university,
      campus: courseData.campus,
      courseName: courseData.courseName,
      courseDescription: courseData.courseDescription,
      learningOutcomes: courseData.learningOutcomes,
      coverImage: null,
      coverPdf: null,
      coverVideoUrl: courseData.coverVideoUrl || ''
    });

    // Set previews for existing files (simulated URLs)
    setImagePreview(courseData.coverImage);
    setPdfPreview(courseData.coverPdf);
  }, [id]);

  // Derived data
  const selectedUniversity = formData.university
    ? universityData[formData.university as keyof typeof universityData]
    : null;

  const campusOptions = selectedUniversity
    ? Object.entries(selectedUniversity.campuses).map(([key, campus]) => ({
        value: key,
        label: `${campus.name} — ${campus.location}`
      }))
    : [];

  // Handlers
  const handleUniversityChange = (selected: { value: string; label: string } | null) => {
    setFormData((prev) => ({
      ...prev,
      university: selected?.value || '',
      campus: '' // Reset campus
    }));
    setImagePreview(null);
    setPdfPreview(null);
  };

  const handleCampusChange = (selected: { value: string; label: string } | null) => {
    setFormData((prev) => ({
      ...prev,
      campus: selected?.value || ''
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image' && file.type.startsWith('image/')) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setImagePreview(URL.createObjectURL(file)); // New preview
    }

    if (type === 'pdf' && file.type === 'application/pdf') {
      setFormData((prev) => ({ ...prev, coverPdf: file }));
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.courseName || !formData.university || !formData.campus) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Prepare FormData for submission
    const payload = new FormData();
    payload.append('university', formData.university);
    payload.append('campus', formData.campus);
    payload.append('courseName', formData.courseName);
    payload.append('courseDescription', formData.courseDescription);
    payload.append('learningOutcomes', formData.learningOutcomes);
    payload.append('coverVideoUrl', formData.coverVideoUrl);

    if (formData.coverImage) payload.append('coverImage', formData.coverImage);
    if (formData.coverPdf) payload.append('coverPdf', formData.coverPdf);

    console.log(`Updating course with ID: ${id}`, Object.fromEntries(payload.entries()));

    // Simulate API update
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Course updated successfully!');
      navigate(-1); // Go back to previous page
    }, 800);
  };

  // React Select Styles
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '32px',
      height: '32px'
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: '32px',
      padding: '0 8px'
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: '32px'
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: '12px'
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '12px'
    })
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
              <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update the details for this course
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-xs text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* University & Campus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label htmlFor="university" className="text-xs font-medium">
                  University
                </Label>
                <Select
                  id="university"
                  options={Object.entries(universityData).map(([key, uni]) => ({
                    value: key,
                    label: uni.name
                  }))}
                  value={
                    formData.university
                      ? {
                          value: formData.university,
                          label:
                            universityData[formData.university as keyof typeof universityData]?.name
                        }
                      : null
                  }
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
                  id="campus"
                  options={campusOptions}
                  value={
                    formData.campus && selectedUniversity
                      ? {
                          value: formData.campus,
                          label: selectedUniversity.campuses[formData.campus]?.name
                        }
                      : null
                  }
                  onChange={handleCampusChange}
                  placeholder={selectedUniversity ? 'Select campus...' : 'Select university first'}
                  styles={selectStyles}
                  isDisabled={!selectedUniversity}
                  isClearable
                />
              </div>
            </div>

            {/* Course Name */}
            <div className="space-y-1">
              <Label htmlFor="courseName" className="text-xs font-medium">
                Course Name
              </Label>
              <Input
                id="courseName"
                placeholder="Enter course name"
                value={formData.courseName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, courseName: e.target.value }))
                }
                required
                className="h-8"
              />
            </div>


            {/* Image, PDF, Video */}
            <div className="flex flex-row items-center gap-4 justify-between flex-wrap">
           

              {/* Cover PDF */}
              <div className="space-y-1 w-full sm:w-auto">
                <Label htmlFor="coverPdf" className="text-xs font-medium">
                  Syllabus PDF
                </Label>
                <Input
                  id="coverPdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, 'pdf')}
                  className="h-8"
                />
                {/* {pdfPreview && (
                  <div className="mt-2">
                    <a
                      href={pdfPreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View uploaded PDF
                    </a>
                  </div>
                )} */}
              </div>

             
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="h-8 px-6 bg-theme text-white hover:bg-theme/90"
                disabled={isSubmitting || !formData.courseName || !formData.university || !formData.campus}
              >
                {isSubmitting ? 'Updating...' : 'Update Course'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}