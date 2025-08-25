import { useEffect, useState } from 'react';
import { Camera, Check, Copy, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/shared/image-uploader';
import moment from 'moment';

const mockAddress = {
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  state: 'California',
  postCode: '90001',
  country: 'USA'
};

export function StudentProfile({ student = {}, fetchStudent }) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!uploadOpen) {
      fetchStudent?.();
    }
  }, [uploadOpen]);

  const handleUploadComplete = () => {
    setUploadOpen(false);
    fetchStudent?.();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(student.refId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const address = student?.addressLine1 ? student : mockAddress;

  // Mock functions for accept/reject
  const handleAccept = () => {
    if (!student._id) return;
    console.log('Accepting application for:', student._id);
    // TODO: Call API to accept
  };

  const handleReject = () => {
    if (!student._id) return;
    console.log('Rejecting application for:', student._id);
    // TODO: Call API to reject
  };

  return (
    <Card className="border-0 shadow-none text-xs">
      {/* Header with Action Buttons */}
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-semibold">Student Application</CardTitle>
        <div className="flex items-center gap-2">
         

          {/* Accept/Reject Buttons */}
          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAccept}>
            Accept
          </Button>
          <Button size="sm" variant="destructive" onClick={handleReject}>
            Reject
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-[auto,1fr,1fr] gap-6 p-4">
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
              <span className="font-medium">Reference No:</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{student?.refId || 'N/A'}</span>
                <button
                  onClick={handleCopy}
                  type="button"
                  className="rounded p-1 transition hover:bg-gray-200"
                  title="Copy Student ID"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

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