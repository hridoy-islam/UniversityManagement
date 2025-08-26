import { useEffect, useState } from 'react';
import { Camera, Check, Copy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ImageUploader } from '@/components/shared/image-uploader';
import moment from 'moment';
import { Button } from '@/components/ui/button';

const mockAddress = {
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  state: 'California',
  postCode: '90001',
  country: 'USA'
};

export function StudentProfile({ student = {}, fetchStudent }) {
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    if (!uploadOpen) {
      fetchStudent?.();
    }
  }, [uploadOpen]);

  const handleUploadComplete = () => {
    setUploadOpen(false);
    fetchStudent?.();
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(student.refId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const address = student?.addressLine1 ? student : mockAddress;

  return (
    <Card className="border-0 shadow-none text-xs">
      <CardContent className="grid grid-cols-[auto,1fr,1fr] gap-6 p-0 py-4">
        <div className="relative">
          <div className="relative h-32 w-32 overflow-hidden rounded-md">
            <img
              src={
                student?.imageUrl ||
                'https://kzmjkvje8tr2ra724fhh.lite.vusercontent.net/placeholder.svg'
              }
              alt={`${student?.firstName || 'Student'} ${student?.lastName || ''}`}
              className="h-full w-full object-cover"
            />
            <Button
              size="icon"
              className="absolute bottom-1 right-1 rounded-full"
              onClick={() => setUploadOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-start">
            <h2 className="text-xs font-semibold text-gray-800">
              {student?.title} {student?.firstName} {student?.lastName}
            </h2>
          </div>

          <div className="grid gap-1">
            

            <div className="flex items-center gap-2">
              <span className="font-medium">Email:</span>
              <span className="text-muted-foreground">{student?.email || 'student@example.com'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Phone:</span>
              <span className="text-muted-foreground">{student?.phone || '+1 234 567 8900'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Date of Birth:</span>
              <span className="text-muted-foreground">
                {student?.dob ? moment(student.dob).format('DD-MM-YYYY') : '01-01-2000'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h3 className="font-medium">Address</h3>
            <div className="mt-1 space-y-1 text-muted-foreground">
              <p>{address.addressLine1}</p>
              <p>{address.addressLine2}</p>
              <p>{address.state}</p>
              <p>{address.postCode}</p>
              <p>{address.country}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <ImageUploader
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadComplete={handleUploadComplete}
        entityId={student?._id}
      />
    </Card>
  );
}
