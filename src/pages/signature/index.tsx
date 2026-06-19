import React, { useEffect, useState } from 'react';
import { Plus, Pen, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosInstance from '@/lib/axios';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';

// Types
interface Signature {
  _id: string;
  signatureId: number;
  name: string;
  documentUrl: string;
}

const signatureSchema = z.object({
  name: z.string().min(1, 'Signature name is required'),
  documentUrl: z.string().optional()
});

type SignatureFormValues = z.infer<typeof signatureSchema>;

export default function SignaturePage() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSignature, setEditingSignature] = useState<Signature | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();

  const form = useForm<SignatureFormValues>({
    resolver: zodResolver(signatureSchema),
    defaultValues: { name: '', documentUrl: '' }
  });

  // Fetch signatures
  const fetchSignatures = async (page = 1, limit = entriesPerPage, search = '') => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit,
        ...(search ? { searchTerm: search } : {})
      };
      const response = await axiosInstance.get('/signature', { params });
      setSignatures(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Failed to fetch signatures', error);
      toast({
        title: "Error",
        description: "Failed to fetch signatures. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignatures(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!dialogOpen) {
      setUploadFile(null);
      setPreviewUrl(null);
      setEditingSignature(null);
      form.reset({ name: '', documentUrl: '' });
    }
  }, [dialogOpen]);

  // File handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('signature-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleAddNew = () => {
    setEditingSignature(null);
    form.reset({ name: '', documentUrl: '' });
    setUploadFile(null);
    setPreviewUrl(null);
    setDialogOpen(true);
  };

  const handleEdit = (signature: Signature) => {
    setEditingSignature(signature);
    form.reset({ name: signature.name, documentUrl: signature.documentUrl });
    setPreviewUrl(signature.documentUrl);
    setDialogOpen(true);
  };

  const onSubmit = async (data: SignatureFormValues) => {
    setSaving(true);
    try {
      let fileUrl = data.documentUrl;

      if (uploadFile) {
        const formData = new FormData();
        formData.append('entityId', user._id);
        formData.append('file_type', 'signatureDoc');
        formData.append('file', uploadFile);

        const documentResponse = await axiosInstance.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        fileUrl = documentResponse.data?.data?.fileUrl;
      }

      const signatureData = { name: data.name, documentUrl: fileUrl };

      if (editingSignature) {
        await axiosInstance.patch(`/signature/${editingSignature._id}`, signatureData);
        toast({
          title: 'Success',
          description: 'Signature updated successfully',
        });
      } else {
        const maxId = signatures.reduce(
          (max, sig) => Math.max(max, sig.signatureId),
          0
        );
        await axiosInstance.post('/signature', {
          ...signatureData,
          signatureId: maxId + 1
        });
        toast({
          title: 'Success',
          description: 'Signature created successfully',
        });
      }

      setDialogOpen(false);
      fetchSignatures(currentPage, entriesPerPage);
    } catch (error) {
      console.error('Failed to save signature', error);
      toast({
        title: "Error",
        description: "Failed to save signature. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = (id: number) => {
    const formatted = `[signature id="${id}"]`;
    navigator.clipboard.writeText(formatted);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSignatures(1, entriesPerPage, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Signatures</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/template')}
                size={'sm'}
              >
                Email Templates
              </Button>
              <Button
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
                onClick={handleAddNew}
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
                New Signature
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search Bar - Rendered if there are items or an active search */}
            {(signatures.length > 0 || searchTerm) && (
              <div className="flex items-center gap-4 mb-6">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name"
                  className="h-8 max-w-[400px] text-xs"
                />
                <Button
                  onClick={handleSearch}
                  size="sm"
                  className="min-w-[100px] border-none bg-theme text-white hover:bg-theme/90 text-xs"
                >
                  Search
                </Button>
                {searchTerm && (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      fetchSignatures(1, entriesPerPage);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-xs px-8"
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}

            {/* Condition 1: Loading State */}
            {loading && signatures.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <BlinkingDots />
              </div>
            ) : 
            
            /* Condition 2: Empty State (No items, no search) */
            signatures.length === 0 && !searchTerm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No signatures found
                </h3>
                <p className="text-gray-500">
                  Get started by creating your first signature
                </p>
              </div>
            ) : 
            
            /* Condition 3: Empty Search Results */
            signatures.length === 0 && searchTerm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-gray-100 p-4 mb-4">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  No results found
                </h3>
                <p className="text-gray-500">
                  No signatures match your search for "{searchTerm}"
                </p>
              </div>
            ) : 
            
            /* Condition 4: Data Table */
            (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Signature Name</TableHead>
                      <TableHead className="text-xs">Signature ID</TableHead>
                      <TableHead className="text-xs">Preview</TableHead>
                      <TableHead className="text-right text-xs">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signatures.map((sig) => (
                      <TableRow key={sig._id}>
                        <TableCell className="font-medium text-xs">{sig.name}</TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{`[signature id="${sig.signatureId}"]`}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCopy(sig.signatureId)}
                            >
                              {copiedId === sig.signatureId ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {sig.documentUrl ? (
                            <a
                              href={sig.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {sig.documentUrl.match(/\.(pdf)$/i) ? (
                                <span>📄 View PDF</span>
                              ) : (
                                <img
                                  src={sig.documentUrl}
                                  alt="Signature"
                                  className="h-12"
                                />
                              )}
                            </a>
                          ) : (
                            <span className="text-gray-400">No document</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className='flex justify-end'>

                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleEdit(sig)}
                            className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                            title="Edit Signature"
                            >
                            <Pen className="h-4 w-4" />
                            Edit
                          </Button>
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <DynamicPagination
                      pageSize={entriesPerPage}
                      setPageSize={setEntriesPerPage}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog is now safely OUTSIDE all early returns */}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSignature ? 'Edit Signature' : 'Add New Signature'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Signature Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Dr. Jane Smith" className="text-xs h-8" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-xs">Upload Signature Document</FormLabel>
                <p className="mb-2 text-xs text-gray-500">
                  Upload a PNG, JPG, or PDF file (recommended: transparent PNG for best results)
                </p>

                {!uploadFile && !previewUrl ? (
                  <label
                    htmlFor="signature-upload"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:bg-gray-50"
                  >
                    <input
                      id="signature-upload"
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf,.webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <svg
                      className="mb-2 h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">
                      Click to upload (PNG, JPG, PDF)
                    </span>
                  </label>
                ) : (
                  <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {uploadFile ? uploadFile.name : 'Existing file'}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 text-xs"
                        onClick={handleRemoveFile}
                      >
                        Remove
                      </Button>
                    </div>

                    {previewUrl && (
                      <div className="mt-2 flex justify-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-20 rounded border bg-white object-contain"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-theme text-white hover:bg-theme/90 text-xs"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      {editingSignature ? 'Updating...' : 'Saving...'}
                    </>
                  ) : editingSignature ? (
                    'Update'
                  ) : (
                    'Save'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}