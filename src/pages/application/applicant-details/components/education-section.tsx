import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CustomDatePicker } from '@/components/shared/CustomDatePicker';
import { ImageUploader } from './document-uploader';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface EducationEntry {
  institution: string;
  qualification: string;
  awardDate: Date | null;
  grade: string;
  certificate: string;
}

const EducationSection = ({ student, onSave }) => {
  const [localData, setLocalData] = useState<{
    educationData: EducationEntry[];
  }>({
    educationData: []
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadState, setUploadState] = useState({ isOpen: false, field: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  // Sync localData when student prop changes
  useEffect(() => {
    if (student && student.educationData) {
      setLocalData({
        educationData: Array.isArray(student.educationData)
          ? JSON.parse(JSON.stringify(student.educationData)) // Deep copy to avoid reference issues
          : []
      });
      setHasChanges(false);
    } else {
      setLocalData({
        educationData: []
      });
      setHasChanges(false);
    }
  }, [student]);

  // Mark changes when localData updates
  useEffect(() => {
    if (student && student.educationData) {
      const hasUnsavedChanges = JSON.stringify(localData.educationData) !== 
        JSON.stringify(student.educationData || []);
      setHasChanges(hasUnsavedChanges);
    }
  }, [localData, student]);

  const handleNestedChange = (section: string, index: number, field: string, value: any) => {
    const updatedArray = [...localData[section]];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setLocalData((prev) => ({ ...prev, [section]: updatedArray }));
  };

  const handleAddEducation = () => {
    const newEntry: EducationEntry = {
      institution: '',
      qualification: '',
      awardDate: null,
      grade: '',
      certificate: ''
    };
    setLocalData((prev) => ({
      ...prev,
      educationData: [...prev.educationData, newEntry]
    }));
  };

  const handleRemoveEducation = (index: number) => {
    const updatedArray = [...localData.educationData];
    updatedArray.splice(index, 1);
    setLocalData((prev) => ({
      ...prev,
      educationData: updatedArray
    }));
  };

  const handleUploadComplete = (uploadResponse: any) => {
    const { field } = uploadState;
    if (!field || !uploadResponse?.success || !uploadResponse.data?.fileUrl) {
      setUploadState({ isOpen: false, field: '' });
      return;
    }

    const uploadedFileUrl = uploadResponse.data.fileUrl;
    const parts = field.split('.');
    const index = parseInt(parts[1], 10);
    const nestedField = parts[2];

    if (!isNaN(index) && nestedField) {
      handleNestedChange('educationData', index, nestedField, uploadedFileUrl);
    }

    setUploadState({ isOpen: false, field: '' });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare data for saving - convert Date objects to ISO strings if needed
      const dataToSave = {
        ...student,
        educationData: localData.educationData.map(entry => ({
          ...entry,
          awardDate: entry.awardDate ? entry.awardDate.toISOString() : null
        }))
      };
      
      await onSave(dataToSave);
      toast({
        title: 'Success',
        description: 'Education data saved successfully.',
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving education data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save education data.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex w-full justify-end gap-2">
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-md bg-green-600 text-xs font-medium text-white hover:bg-green-700"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
        <Button
          onClick={handleAddEducation}
          className="rounded-md bg-theme text-xs font-medium text-white hover:bg-theme/90"
        >
          + Add Education
        </Button>
      </div>

      {(localData.educationData || []).length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-xs text-gray-500">No education entries added yet.</p>
          <p className="mt-1 text-xs text-gray-400">Click "Add Education" to get started.</p>
        </div>
      ) : (
        (localData.educationData || []).map((entry, index) => (
          <div
            key={index}
            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <div className="absolute right-4 top-4">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveEducation(index)}
                className="h-7 text-xs"
              >
                Remove
              </Button>
            </div>

            <h4 className="mb-4 text-sm font-medium text-gray-800">
              Education Entry #{index + 1}
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Institution
                </label>
                <Input
                  value={entry.institution || ''}
                  onChange={(e) =>
                    handleNestedChange(
                      'educationData',
                      index,
                      'institution',
                      e.target.value
                    )
                  }
                  placeholder="Enter Institution"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Qualification
                </label>
                <Input
                  value={entry.qualification || ''}
                  onChange={(e) =>
                    handleNestedChange(
                      'educationData',
                      index,
                      'qualification',
                      e.target.value
                    )
                  }
                  placeholder="Enter Qualification"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Award Date
                </label>
                <CustomDatePicker
                  selected={entry.awardDate ? new Date(entry.awardDate) : null}
                  onChange={(date) =>
                    handleNestedChange('educationData', index, 'awardDate', date)
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Grade
                </label>
                <Input
                  value={entry.grade || ''}
                  onChange={(e) =>
                    handleNestedChange(
                      'educationData',
                      index,
                      'grade',
                      e.target.value
                    )
                  }
                  placeholder="Enter Grade"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Certificate
                </label>
                <div>
                  <Button
                    type="button"
                    onClick={() =>
                      setUploadState({
                        isOpen: true,
                        field: `educationData.${index}.certificate`
                      })
                    }
                    className="mt-1 bg-theme text-white hover:bg-theme/90"
                  >
                    Upload Certificate
                  </Button>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF, JPG, PNG. Max size 5MB.
                  </p>

                  {entry.certificate && (
                    <div className="mt-2 flex items-center gap-2">
                      <a
                        href={entry.certificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline"
                      >
                        View Certificate
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleNestedChange(
                            'educationData',
                            index,
                            'certificate',
                            ''
                          )
                        }
                        className="h-6 text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <ImageUploader
        open={uploadState.isOpen}
        onOpenChange={(isOpen) =>
          setUploadState({ isOpen, field: uploadState.field })
        }
        onUploadComplete={handleUploadComplete}
        entityId={user?._id}
      />
    </div>
  );
};

export default EducationSection;