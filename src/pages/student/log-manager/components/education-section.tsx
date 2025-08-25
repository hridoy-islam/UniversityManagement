import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { CustomDatePicker } from '@/components/shared/CustomDatePicker';
import { ImageUploader } from './document-uploader';
import { useSelector } from 'react-redux';

// Mock data for demonstration
const mockEducationData = [
  {
    institution: 'University of London',
    qualification: 'BSc Computer Science',
    awardDate: '2017-06-30',
    grade: 'A',
    certificate: ''
  },
  {
    institution: 'Oxford College',
    qualification: 'MSc Information Systems',
    awardDate: '2019-07-15',
    grade: 'A+',
    certificate: ''
  }
];

const EducationSection = ({ student, onSave }) => {
  const [localData, setLocalData] = useState({
    educationData: mockEducationData // Default to mock data
  });

  const [uploadState, setUploadState] = useState({ isOpen: false, field: '' });
  const { user } = useSelector((state) => state.auth);

  // Sync localData when student prop changes
  useEffect(() => {
    if (student && student.educationData) {
      setLocalData({
        ...student,
        educationData: Array.isArray(student.educationData)
          ? student.educationData
          : mockEducationData
      });
    } else {
      setLocalData((prev) => ({
        ...prev,
        educationData: mockEducationData // fallback to mock
      }));
    }
  }, [student]);

  const handleNestedChange = (section, index, field, value) => {
    const updatedArray = [...localData[section]];
    updatedArray[index] = { ...updatedArray[index], [field]: value };
    setLocalData((prev) => ({ ...prev, [section]: updatedArray }));
  };

  const handleAddEducation = () => {
    const newEntry = {
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

  const handleUploadComplete = (uploadResponse) => {
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

  return (
    <div className="space-y-6 text-xs">

  {(localData.educationData || []).map((entry, index) => (
    <div
      key={index}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h4 className="mb-2 text-xs font-medium text-gray-800">
        Education {index + 1}
      </h4>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-700">
            Institution
          </label>
          <Input
            value={entry.institution || ''}
            onChange={(e) =>
              handleNestedChange('educationData', index, 'institution', e.target.value)
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
              handleNestedChange('educationData', index, 'qualification', e.target.value)
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
            className="text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">
            Grade
          </label>
          <Input
            value={entry.grade || ''}
            onChange={(e) =>
              handleNestedChange('educationData', index, 'grade', e.target.value)
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
            <button
              type="button"
              onClick={() =>
                setUploadState({
                  isOpen: true,
                  field: `educationData.${index}.certificate`
                })
              }
              className="mt-1 rounded-md bg-theme px-4 py-1 text-xs font-medium text-white hover:bg-theme/90"
            >
              Upload Certificate
            </button>
            <p className="mt-1 text-xs text-gray-500">
              PDF, JPG, PNG. Max size 5MB.
            </p>

            {entry.certificate && (
              <a
                href={entry.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 underline"
              >
                View Certificate
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}

  <div className="flex w-full justify-end">
    <button
      type="button"
      onClick={handleAddEducation}
      className="mt-4 rounded-md bg-theme px-4 py-1 text-xs font-medium text-white hover:bg-theme/90"
    >
      + Add Education
    </button>
  </div>

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
