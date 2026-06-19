import { useEffect, useState } from "react";
import { Eye, Plus, Trash2, Search, RefreshCw, FileText, Image, File, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentDialog } from "./document-dialog";
import axiosInstance from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

interface Document {
  _id?: string;
  file_type: string;
  fileUrl: string;
  uploadedBy?: string;
  uploadDate?: string;
  checked?: string;
  fileName?: string;
  fileSize?: number;
  url?: string;
}

interface DocumentsSectionProps {
  student: any;
  onSave?: (data: any) => void;
}

export default function DocumentsSection({ student, onSave }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [viewDialog, setViewDialog] = useState<Document | null>(null);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Map student document arrays to document list
  const mapStudentDocumentsToArray = (studentData: any): Document[] => {
    const docs: Document[] = [];
    
    // Helper to add documents from an array with a specific type
    const addDocuments = (docArray: string[], type: string) => {
      if (Array.isArray(docArray)) {
        docArray.forEach((url, index) => {
          if (url && typeof url === 'string') {
            docs.push({
              _id: `${type}_${index}`,
              file_type: type,
              fileUrl: url,
              url: url,
              fileName: url.split('/').pop() || type
            });
          }
        });
      }
    };

    // Add all document types from student data
    addDocuments(studentData?.idDocument, "ID Document");
    addDocuments(studentData?.passport, "Passport");
    addDocuments(studentData?.photoId, "Photo ID");
    addDocuments(studentData?.proofOfAddress, "Proof of Address");
    addDocuments(studentData?.qualification, "Qualification");
    addDocuments(studentData?.qualificationCertificates, "Qualification Certificate");
    addDocuments(studentData?.certificatesDetails, "Certificate Details");
    addDocuments(studentData?.otherDocuments, "Other Document");
    addDocuments(studentData?.immigrationDocument, "Immigration Document");
    addDocuments(studentData?.personalStatement, "Personal Statement");
    addDocuments(studentData?.bankStatement, "Bank Statement");
    addDocuments(studentData?.workExperience, "Work Experience");
    addDocuments(studentData?.previousEmployments, "Previous Employment");

    return docs;
  };

  // Load documents from student data
  useEffect(() => {
    if (student) {
      const docs = mapStudentDocumentsToArray(student);
      setDocuments(docs);
      setLoading(false);
    }
  }, [student]);

  const handleRefresh = () => {
    setRefreshing(true);
    if (onSave) {
      onSave(student);
    }
    const docs = mapStudentDocumentsToArray(student);
    setDocuments(docs);
    setTimeout(() => setRefreshing(false), 500);
  };

  // Handle document upload completion
  const handleUploadComplete = async (uploadResponse: any) => {
    if (uploadResponse?.success && uploadResponse.data?.fileUrl) {
      const fileUrl = uploadResponse.data.fileUrl;
      const fileType = uploadResponse.data.file_type || "Document";
      
      const documentFieldMap: { [key: string]: string } = {
        'idDocument': 'idDocument',
        'passport': 'passport',
        'photoId': 'photoId',
        'proofOfAddress': 'proofOfAddress',
        'qualification': 'qualification',
        'qualificationCertificates': 'qualificationCertificates',
        'certificatesDetails': 'certificatesDetails',
        'otherDocuments': 'otherDocuments',
        'immigrationDocument': 'immigrationDocument',
        'personalStatement': 'personalStatement',
        'bankStatement': 'bankStatement',
        'workExperience': 'workExperience',
        'previousEmployments': 'previousEmployments'
      };

      const fieldName = documentFieldMap[uploadResponse.data.file_type] || 'otherDocuments';
      
      const updatedStudent = {
        ...student,
        [fieldName]: [...(student[fieldName] || []), fileUrl]
      };

      try {
        const response = await axiosInstance.patch(`/users/${student._id}`, updatedStudent);
        if (response.data.success) {
          const newDoc: Document = {
            _id: `${fieldName}_${Date.now()}`,
            file_type: fileType,
            fileUrl: fileUrl,
            url: fileUrl,
            fileName: fileUrl.split('/').pop() || fileType
          };
          setDocuments([...documents, newDoc]);
          
          toast({
            title: 'Success',
            description: 'Document uploaded successfully.',
            className: 'bg-green-600 text-white',
          });
          
          if (onSave) onSave(updatedStudent);
        }
      } catch (error) {
        console.error('Error saving document:', error);
        toast({
          title: 'Error',
          description: 'Failed to save document.',
          variant: 'destructive',
        });
      }
    }
    setDialogOpen(false);
  };

  const confirmDelete = (doc: Document) => {
    setDeleteDialog(doc._id || null);
  };

  const cancelDelete = () => {
    setDeleteDialog(null);
  };

  const performDelete = async () => {
    const docToDelete = documents.find(doc => doc._id === deleteDialog);
    if (!docToDelete) return;

    const fieldMapping: { [key: string]: string } = {
      'ID Document': 'idDocument',
      'Passport': 'passport',
      'Photo ID': 'photoId',
      'Proof of Address': 'proofOfAddress',
      'Qualification': 'qualification',
      'Qualification Certificate': 'qualificationCertificates',
      'Certificate Details': 'certificatesDetails',
      'Other Document': 'otherDocuments',
      'Immigration Document': 'immigrationDocument',
      'Personal Statement': 'personalStatement',
      'Bank Statement': 'bankStatement',
      'Work Experience': 'workExperience',
      'Previous Employment': 'previousEmployments'
    };

    const fieldName = fieldMapping[docToDelete.file_type] || 'otherDocuments';
    
    const updatedStudent = {
      ...student,
      [fieldName]: (student[fieldName] || []).filter((url: string) => url !== docToDelete.fileUrl)
    };

    try {
      const response = await axiosInstance.patch(`/users/${student._id}`, updatedStudent);
      if (response.data.success) {
        setDocuments(documents.filter((doc) => doc._id !== deleteDialog));
        toast({
          title: 'Success',
          description: 'Document deleted successfully.',
          className: 'bg-green-600 text-white',
        });
        if (onSave) onSave(updatedStudent);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  // Get file extension from URL
  const getFileExtension = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension;
  };

  // Check if file is an image
  const isImage = (url: string): boolean => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const ext = getFileExtension(url);
    return imageExtensions.includes(ext);
  };

  // Check if file is a video
  const isVideo = (url: string): boolean => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    const ext = getFileExtension(url);
    return videoExtensions.includes(ext);
  };

  // Check if file is a PDF
  const isPdf = (url: string): boolean => {
    return getFileExtension(url) === 'pdf';
  };

  // Check if file is a Word document
  const isDocx = (url: string): boolean => {
    const docExtensions = ['doc', 'docx'];
    const ext = getFileExtension(url);
    return docExtensions.includes(ext);
  };

  // Get Google Docs viewer URL for PDF and Office files
  const getGoogleDocsViewerUrl = (url: string): string => {
    return `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(url)}`;
  };

  // Handle download
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: 'Error',
        description: 'Failed to download file.',
        variant: 'destructive',
      });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesQuery = doc.file_type.toLowerCase().includes(query.toLowerCase());
    return matchesQuery;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.toLowerCase().includes('photo') || fileType.toLowerCase().includes('image')) return <Image className="h-4 w-4" />;
    if (fileType.toLowerCase().includes('passport')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  // Document Viewer Component
  const DocumentViewer = ({ document, onClose }: { document: Document; onClose: () => void }) => {
    const [loading, setLoading] = useState(true);
    const fileUrl = document.fileUrl;
    const isImageFile = isImage(fileUrl);
    const isVideoFile = isVideo(fileUrl);
    const isPdfFile = isPdf(fileUrl);
    const isDocxFile = isDocx(fileUrl);
    const isGoogleStorage = fileUrl.includes('storage.googleapis.com');

    return (
      <Dialog open={!!document} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{document.file_type}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(fileUrl, document.fileName || document.file_type)}
                className="ml-2"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto min-h-[500px]">
            {isImageFile && (
              <div className="flex items-center justify-center min-h-[500px] bg-gray-100 rounded-lg">
                <img
                  src={fileUrl}
                  alt={document.file_type}
                  className="max-w-full max-h-[70vh] object-contain"
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              </div>
            )}

            {isVideoFile && (
              <div className="flex items-center justify-center min-h-[500px] bg-black rounded-lg">
                <video
                  controls
                  className="max-w-full max-h-[70vh]"
                  autoPlay={false}
                  onLoadedData={() => setLoading(false)}
                >
                  <source src={fileUrl} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {(isPdfFile || isDocxFile) && (
              <div className="w-full h-[70vh] bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src={getGoogleDocsViewerUrl(fileUrl)}
                  className="w-full h-full border-0"
                  title={document.file_type}
                  onLoad={() => setLoading(false)}
                />
              </div>
            )}

            {!isImageFile && !isVideoFile && !isPdfFile && !isDocxFile && (
              <div className="flex flex-col items-center justify-center min-h-[500px] bg-gray-100 rounded-lg p-8">
                <File className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                <Button
                  onClick={() => handleDownload(fileUrl, document.fileName || document.file_type)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-theme border-t-transparent"></div>
                  <p className="text-sm text-gray-500">Loading document...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-4 rounded-md p-4 shadow-sm border border-gray-300 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Documents</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 h-9 text-xs w-48"
            />
          </div>
          
          <Button
            className="bg-theme text-white hover:bg-theme/90"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs">Document Name</TableHead>
            <TableHead className="text-right text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-theme border-t-transparent"></div>
                  <span className="text-xs text-gray-500">Loading documents...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No documents found</p>
                <p className="text-xs mt-1">Click "Add Document" to upload files</p>
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((doc, index) => (
              <TableRow
                key={doc._id || index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="font-medium text-xs">
                  <div className="flex items-center gap-2">
                    {getFileIcon(doc.file_type)}
                    <span>{doc.file_type}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => setViewDialog(doc)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => confirmDelete(doc)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {deleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelDelete}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete} className="text-xs">
                Cancel
              </Button>
              <Button variant="destructive" onClick={performDelete} className="text-xs">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Dialog */}
      {viewDialog && (
        <DocumentViewer
          document={viewDialog}
          onClose={() => setViewDialog(null)}
        />
      )}

      {/* Document Dialog for Upload */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUploadComplete={handleUploadComplete}
        entityId={student?._id}
      />
    </div>
  );
}