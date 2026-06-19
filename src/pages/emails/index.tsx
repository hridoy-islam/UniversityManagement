import { useEffect, useState } from 'react';
import { Pen, Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { EmailConfigDialog } from './components/email-config-dialog';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '../../lib/axios';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { Input } from '@/components/ui/input';
import { DynamicPagination } from '@/components/shared/DynamicPagination';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function EmailConfigPage() {
  const [emailConfigs, setEmailConfigs] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmailConfig, setEditingEmailConfig] = useState<any>(null);
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const fetchData = async (page = 1, limit = entriesPerPage, search = '') => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/email-configs`, {
        params: {
          page,
          limit,
          ...(search ? { searchTerm: search } : {}),
        },
      });
      setEmailConfigs(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error) {
      console.error('Error fetching email configurations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email configurations. Please try again.",
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
      if (editingEmailConfig) {
        await axiosInstance.patch(`/email-configs/${editingEmailConfig?._id}`, data);
        toast({
          title: 'Success',
          description: 'Email configuration updated successfully',
        });
      } else {
        await axiosInstance.post(`/email-configs`, data);
        toast({
          title: 'Success',
          description: 'Email configuration created successfully',
        });
      }
      fetchData(currentPage, entriesPerPage);
      setEditingEmailConfig(null);
    } catch (error: any) {
      console.error('Error saving email configuration:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to save email configuration. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (emailConfig: any) => {
    setEditingEmailConfig(emailConfig);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingEmailConfig(null);
    setDialogOpen(true);
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

  // Show loading state
  if (loading && emailConfigs.length === 0) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Configurations</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/email-templates')}
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
                New Configuration
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
  if (emailConfigs.length === 0 && !searchTerm) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Configurations</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/email-templates')}
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
                New Configuration
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No email configurations found
              </h3>
              <p className="text-gray-500">
                Get started by creating your first email configuration
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty search results
  if (emailConfigs.length === 0 && searchTerm) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Email Configurations</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/email-templates')}
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
                New Configuration
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
                placeholder="Search by Email"
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
                No configurations match your search for "{searchTerm}"
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
              <CardTitle className="text-2xl font-bold">Email Configurations</CardTitle>
            </div>
            <div className="flex gap-4">
              <Button
                className="bg-theme text-white hover:bg-theme/90 text-xs"
                onClick={() => navigate('/dashboard/email-templates')}
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
                New Configuration
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
                placeholder="Search by Email"
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
                  <TableHead className="text-xs">Email</TableHead>
                  <TableHead className="text-xs">Host</TableHead>
                  <TableHead className="text-xs">Port</TableHead>
                  <TableHead className="text-xs">Encryption</TableHead>
                  <TableHead className="text-xs">Authentication</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailConfigs.map((config: any) => (
                  <TableRow key={config._id}>
                    <TableCell className="font-medium text-xs">{config.email}</TableCell>
                    <TableCell className="text-xs">{config.host}</TableCell>
                    <TableCell className="text-xs">{config.port}</TableCell>
                    <TableCell className="text-xs">{config.encryption}</TableCell>
                    <TableCell className="text-xs">
                      {config.authentication ? 'True' : 'False'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className='flex justify-end'>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleEdit(config)}
                        className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                        title="Edit Configuration"
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

      {/* Add/Edit Dialog */}
      <EmailConfigDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingEmailConfig(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEmailConfig}
      />
    </>
  );
}