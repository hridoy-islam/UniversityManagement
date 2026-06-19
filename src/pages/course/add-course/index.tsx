import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';

// Updated Zod validation schema making all four fields required
const courseSchema = z.object({
  name: z
    .string()
    .min(1, "Course name is required")
    .max(100, "Course name must be less than 100 characters")
    .trim(),
  courseCode: z
    .string()
    .min(1, "Course code is required")
    .max(20, "Course code must be less than 20 characters")
    .trim(),
  intakeId: z
    .string()
    .min(1, "Intake / Term is required"),
  awardingBodyId: z
    .string()
    .min(1, "Awarding body is required"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface IntakeType {
  _id: string;
  termName: string;
  status: number;
}

interface AwardingBodyType {
  _id: string;
  name: string;
  status: number;
}

interface FormErrors {
  name?: string;
  courseCode?: string;
  description?: string;
  intakeId?: string;
  awardingBodyId?: string;
}

export default function AddCoursePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    courseCode: '',
    description: '',
    intakeId: '',
    awardingBodyId: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [intakes, setIntakes] = useState<IntakeType[]>([]);
  const [awardingBodies, setAwardingBodies] = useState<AwardingBodyType[]>([]);
  const [loadingIntakes, setLoadingIntakes] = useState(true);
  const [loadingAwardingBodies, setLoadingAwardingBodies] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchIntakes = async () => {
      try {
        const res = await axiosInstance.get("/terms", { 
          params: { page: 1, limit: 'all' } 
        });
        const data = res.data.data.result;
        const activeIntakes = data.filter((intake: IntakeType) => intake.status === 1);
        setIntakes(activeIntakes);
      } catch (error) {
        console.error("Failed to fetch intakes:", error);
        toast.error("Failed to load intakes");
      } finally {
        setLoadingIntakes(false);
      }
    };

    const fetchAwardingBodies = async () => {
      try {
        const res = await axiosInstance.get("/awarding-body", { 
          params: { page: 1, limit: 'all' } 
        });
        const data = res.data.data.result;
        setAwardingBodies(data);
      } catch (error) {
        console.error("Failed to fetch awarding bodies:", error);
        toast.error("Failed to load awarding bodies");
      } finally {
        setLoadingAwardingBodies(false);
      }
    };

    fetchIntakes();
    fetchAwardingBodies();
  }, []);

  const validateField = (field: keyof CourseFormData, value: string) => {
    try {
      const fieldSchema = z.object({
        [field]: courseSchema.shape[field]
      });
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error: any) {
      if (error.errors?.[0]) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
    }
  };

  const handleInputChange = (field: keyof CourseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: keyof CourseFormData) => {
    validateField(field, formData[field]);
  };

  const handleIntakeChange = (selected: { value: string; label: string } | null) => {
    const value = selected?.value || '';
    setFormData(prev => ({ ...prev, intakeId: value }));
    validateField('intakeId', value);
  };

  const handleAwardingBodyChange = (selected: { value: string; label: string } | null) => {
    const value = selected?.value || '';
    setFormData(prev => ({ ...prev, awardingBodyId: value }));
    validateField('awardingBodyId', value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = courseSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const fieldErrors: FormErrors = {};
      validationResult.error.errors.forEach((error) => {
        const field = error.path[0] as keyof FormErrors;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setSubmitting(true);

    const payload = {
      name: validationResult.data.name,
      courseCode: validationResult.data.courseCode,
      description: validationResult.data.description || null,
      intakeId: validationResult.data.intakeId,
      awardingBodyId: validationResult.data.awardingBodyId,
      status: 1,
    };

    try {
      await axiosInstance.post('/courses', payload);
      toast.success('Course created successfully!');
      navigate(-1);
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  // Fixed style calculation to dynamically read errors map for single elements
  const getSelectStyles = (hasError: boolean) => ({
    control: (base: any) => ({ 
      ...base, 
      minHeight: '32px', 
      height: '32px',
      fontSize: '12px',
      borderColor: hasError ? '#ef4444' : base.borderColor,
      '&:hover': {
        borderColor: hasError ? '#ef4444' : base.borderColor,
      }
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
    input: (base: any) => ({
      ...base,
      fontSize: '12px'
    }),
    menu: (base: any) => ({ 
      ...base, 
      fontSize: '12px' 
    }),
    option: (base: any) => ({
      ...base,
      fontSize: '12px'
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '12px'
    }),
  });

  const intakeOptions = intakes.map(intake => ({
    value: intake._id,
    label: intake.termName,
  }));

  const awardingBodyOptions = awardingBodies.map(body => ({
    value: body._id,
    label: body.name,
  }));

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
          <form onSubmit={handleSubmit} className="space-y-6 text-xs" noValidate>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-medium">
                  Course Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter course name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  onBlur={() => handleInputBlur('name')}
                  className={`h-8 text-xs ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="courseCode" className="text-xs font-medium">
                  Course Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="courseCode"
                  placeholder="Enter course code"
                  value={formData.courseCode}
                  onChange={e => handleInputChange('courseCode', e.target.value)}
                  onBlur={() => handleInputBlur('courseCode')}
                  className={`h-8 text-xs ${errors.courseCode ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.courseCode && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.courseCode}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="intake" className="text-xs font-medium">
                  Intake / Term <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={intakeOptions}
                  onChange={handleIntakeChange}
                  placeholder={loadingIntakes ? "Loading intakes..." : "Select intake..."}
                  styles={getSelectStyles(!!errors.intakeId)}
                  isClearable
                  isDisabled={loadingIntakes}
                  isLoading={loadingIntakes}
                  noOptionsMessage={() => "No intakes found"}
                />
                {errors.intakeId && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.intakeId}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="awardingBody" className="text-xs font-medium">
                  Awarding Body <span className="text-red-500">*</span>
                </Label>
                <Select
                  options={awardingBodyOptions}
                  onChange={handleAwardingBodyChange}
                  placeholder={loadingAwardingBodies ? "Loading awarding bodies..." : "Select awarding body..."}
                  styles={getSelectStyles(!!errors.awardingBodyId)}
                  isClearable
                  isDisabled={loadingAwardingBodies}
                  isLoading={loadingAwardingBodies}
                  noOptionsMessage={() => "No awarding bodies found"}
                />
                {errors.awardingBodyId && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.awardingBodyId}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                onBlur={() => handleInputBlur('description')}
                className={`text-xs ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] mt-1">{errors.description}</p>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="h-8 bg-theme px-6 text-white hover:bg-theme/90 text-xs"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Course'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}