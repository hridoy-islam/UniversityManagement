import { useState, useEffect } from 'react';
import { Plus, Pen, Download, Loader2 } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import axiosInstance from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { downloadEmailPDF } from './components/pdf-generator';
import { EmailDraftDialog } from './components/email-draft-dialog';
import { useNavigate } from 'react-router-dom';

const TemplatePage = () => {
  const [drafts, setDrafts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (page = 1, limit = entriesPerPage, search = '') => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/email-drafts`, {
        params: {
          page,
          limit,
          ...(search ? { searchTerm: search } : {})
        }
      });
      setDrafts(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email templates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleSubmit = async (data: any) => {
    try {
      if (editingDraft) {
        await axiosInstance.patch(`/email-drafts/${editingDraft?._id}`, data);
        toast({
          title: 'Success',
          description: 'Template updated successfully',
        });
        fetchData(currentPage, entriesPerPage);
        setEditingDraft(null);
      } else {
        await axiosInstance.post(`/email-drafts`, data);
        toast({
          title: 'Success',
          description: 'Template created successfully',
        });
        fetchData(currentPage, entriesPerPage);
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, entriesPerPage, searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDownloadPDF = async (draft: any) => {
    try {
      setDownloadingPdf(draft._id);
      await downloadEmailPDF(draft.subject, draft.body);
      toast({
        title: 'Success',
        description: 'PDF downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to download PDF. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setDownloadingPdf(null);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/signature')}
                size={'sm'}
              >
                Signature
              </Button>
              <Button
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
                onClick={() => setDraftDialogOpen(true)}
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <BlinkingDots />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (drafts.length === 0 && !searchTerm) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/signature')}
                size={'sm'}
              >
                Signature
              </Button>
              <Button
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
                onClick={() => navigate('create')}
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No email templates found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first email template
              </p>
            
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty search results
  if (drafts.length === 0 && searchTerm) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/signature')}
                size={'sm'}
              >
                Signature
              </Button>
              <Button
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
                onClick={() => navigate('create')}
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by Subject"
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
                    fetchData(1, entriesPerPage);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
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
                No templates match your search for "{searchTerm}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show table with data
  return (
    <>
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Templates</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/signature')}
                size={'sm'}
              >
                Signature
              </Button>
              <Button
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
                onClick={() => navigate('create')}
                size={'sm'}
              >
                <Plus className="h-4 w-4" />
                New Template
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search by Subject"
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
                    fetchData(1, entriesPerPage);
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs px-8"
                >
                  Clear
                </Button>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Subject</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drafts.map((draft: any) => (
                  <TableRow key={draft._id}>
                    <TableCell className="font-medium text-xs">{draft.subject}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleDownloadPDF(draft)}
                          disabled={downloadingPdf === draft._id}
                          className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 text-xs"
                          title="Download PDF"
                        >
                          {downloadingPdf === draft._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          PDF
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                                         onClick={() => navigate(draft._id)}

                          className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                          title="Edit Template"
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
          </CardContent>
        </Card>
      </div>
      <EmailDraftDialog
        open={draftDialogOpen}
        onOpenChange={(open) => {
          setDraftDialogOpen(open);
          if (!open) setEditingDraft(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingDraft}
      />
    </>
  );
};

export default TemplatePage;