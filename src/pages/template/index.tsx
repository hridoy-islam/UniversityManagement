import { useState, useEffect } from 'react';
import { Plus, Pen, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { downloadEmailPDF } from './components/pdf-generator';
import { EmailDraftDialog } from './components/email-draft-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TemplatePage = () => {
  const [drafts, setDrafts] = useState<any>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null);

  const fetchData = async (page, entriesPerPage, searchTerm = '') => {
    try {
      if (initialLoading) setInitialLoading(true);
      const response = await axiosInstance.get(`/email-drafts`, {
        params: {
          page,
          limit: entriesPerPage,
          ...(searchTerm ? { searchTerm } : {})
        }
      });
      setDrafts(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    } finally {
      setInitialLoading(false); // Disable initial loading after the first fetch
    }
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage); // Refresh data
  }, [currentPage, entriesPerPage]);

  const handleSubmit = async (data) => {
    try {
      if (editingDraft) {
        // Update institution
        await axiosInstance.patch(`/email-drafts/${editingDraft?._id}`, data);
        toast({
          title: 'Template Updated successfully',
          className: 'bg-theme border-none text-white'
        });
        fetchData(currentPage, entriesPerPage);
        setEditingDraft(null);
      } else {
        await axiosInstance.post(`/email-drafts`, data);
        toast({
          title: 'Template Created successfully',
          className: 'bg-theme border-none text-white'
        });
        fetchData(currentPage, entriesPerPage);
      }
    } catch (error) {
      console.error('Error saving institution:', error);
    }
  };

  const handleSearch = () => {
    fetchData(currentPage, entriesPerPage, searchTerm);
  };

  const handleDownloadPDF = async (draft: any) => {
    try {
      setDownloadingPdf(draft._id);
      await downloadEmailPDF(draft.subject, draft.body);
      toast({
        title: 'PDF downloaded successfully',
        className: 'bg-theme border-none text-white'
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: 'Error downloading PDF',
        description: 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setDownloadingPdf(null);
    }
  };

  return (
  <Card className=" bg-white">
    <CardHeader className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <CardTitle className="text-2xl font-semibold">Email Templates</CardTitle>

          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Subject"
              className="h-8 max-w-[400px]"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="min-w-[100px] border-none bg-theme text-white hover:bg-theme/90"
            >
              Search
            </Button>
          </div>
        </div>

        <Button
          className="bg-theme text-white hover:bg-theme/90"
          onClick={() => setDraftDialogOpen(true)}
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>
    </CardHeader>

    <CardContent className="p-4">
      {initialLoading ? (
        <div className="flex justify-center py-6">
          <BlinkingDots size="large" color="bg-theme" />
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex justify-center py-6 text-gray-500">
          No drafts found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drafts.map((draft) => (
              <TableRow key={draft._id}>
                <TableCell>{draft.subject}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Download PDF */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownloadPDF(draft)}
                      disabled={downloadingPdf === draft._id}
                      className="border-green-600 bg-green-600 text-white hover:bg-green-700"
                      title="Download PDF"
                    >
                      {downloadingPdf === draft._id ? (
                        <BlinkingDots size="small" color="bg-white" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Edit Template */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingDraft(draft);
                        setDraftDialogOpen(true);
                      }}
                      className="bg-theme text-white hover:bg-theme/90"
                      title="Edit Template"
                    >
                      <Pen className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-4">
        <DataTablePagination
          pageSize={entriesPerPage}
          setPageSize={setEntriesPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </CardContent>

    <EmailDraftDialog
      open={draftDialogOpen}
      onOpenChange={(open) => {
        setDraftDialogOpen(open);
        if (!open) setEditingDraft(null);
      }}
      onSubmit={handleSubmit}
      initialData={editingDraft}
    />
  </Card>
);

};

export default TemplatePage;
