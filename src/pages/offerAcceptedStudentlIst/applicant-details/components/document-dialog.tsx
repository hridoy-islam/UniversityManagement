import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { mockData } from '@/types';
import axiosInstance from '@/lib/axios';
import { useParams } from 'react-router-dom';
import ReactSelect from 'react-select';

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (response?: any) => void;
  entityId: string;
}

export function DocumentDialog({
  open,
  onOpenChange,
  onUploadComplete,
  entityId
}: DocumentDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<{ value: string; label: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [customType, setCustomType] = useState<string>('');
  const { id } = useParams();

  // Transform document types to react-select options
  const documentTypeOptions = mockData.DocumentType.map((type) => ({
    value: type.toLowerCase(),
    label: type
  }));

  // Add "Other" option
  const allOptions = [
    ...documentTypeOptions,
    { value: 'other', label: 'Other' }
  ];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedType) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('entityId', entityId);
    
    // Determine file type value
    let fileTypeValue = selectedType.value;
    if (selectedType.value === 'other') {
      fileTypeValue = customType;
    }
    formData.append('file_type', fileTypeValue);
    formData.append('file', file);

    try {
      const response = await axiosInstance.post('/documents', formData, {  headers: {
    "Content-Type": "multipart/form-data",
  },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        onUploadComplete?.(response.data);
      } else {
        onUploadComplete?.();
      }
      
      // Reset form
      setFile(null);
      setSelectedType(null);
      setCustomType('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFile(null);
      setSelectedType(null);
      setCustomType('');
      setUploadProgress(0);
      setIsUploading(false);
    }
    onOpenChange(isOpen);
  };

  // Styles for react-select
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '36px',
      height: '36px',
      fontSize: '0.875rem',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 8px',
      height: '34px'
    }),
    input: (base: any) => ({
      ...base,
      fontSize: '0.875rem',
      margin: 0,
      padding: 0
    }),
    option: (base: any) => ({
      ...base,
      fontSize: '0.875rem',
      padding: '8px 12px'
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: '0.875rem'
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '0.875rem',
      zIndex: 50
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '0.875rem'
    })
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <ReactSelect
              options={allOptions}
              value={selectedType}
              onChange={(option) => setSelectedType(option)}
              placeholder="Select document type"
              isSearchable
              styles={selectStyles}
              isDisabled={isUploading}
            />
            {selectedType?.value === 'other' && (
              <Input
                type="text"
                placeholder="Describe the document type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className="mt-2"
                disabled={isUploading}
                required
              />
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">File</label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isUploading}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: Images, PDF, DOC, DOCX (Max size: 5MB)
            </p>
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-center text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                !file ||
                !selectedType ||
                isUploading ||
                (selectedType?.value === 'other' && !customType)
              }
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}