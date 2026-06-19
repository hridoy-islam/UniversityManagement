import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { BlinkingDots } from "@/components/shared/blinking-dots";
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

interface CampusType {
  _id: string;
  campusName: string;
  contactPerson: string;
  logo: string;
}

export default function CampusPage() {
  const [campuses, setCampuses] = useState<CampusType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<CampusType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchCampuses = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      const res = await axiosInstance.get("/campuses", { params });
      const campusData = res.data.data.result;
      setTotalPages(res.data.data.meta.totalPage || 1);
      setCampuses(campusData);
    } catch (error) {
      console.error("Failed to fetch campuses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch campuses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampuses(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleDeleteClick = (campus: CampusType) => {
    setSelectedCampus(campus);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCampus) return;
    
    setDeleting(true);
    try {
      await axiosInstance.delete(`/campuses/${selectedCampus._id}`);

          setCampuses(prevCampuses => 
        prevCampuses.filter(campus => campus._id !== selectedCampus._id)
      );
      
      toast({
        title: "Success",
        description: `${selectedCampus.campusName} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setSelectedCampus(null);
    } catch (error) {
      console.error("Failed to delete campus:", error);
      toast({
        title: "Error",
        description: "Failed to delete campus. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Campus Management</CardTitle>
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Campus
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <BlinkingDots/>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show empty state
  if (campuses.length === 0) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Campus Management</CardTitle>
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Campus
              </Button>
            </Link>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No campuses found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first campus
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
              <CardTitle className="text-2xl font-bold">Campus Management</CardTitle>
              
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Campus
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Campus Name</TableHead>
                  <TableHead className="text-xs">Contact Person</TableHead>
                  <TableHead className="text-xs">Logo</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campuses.map((campus) => (
                  <TableRow key={campus._id}>
                    <TableCell className="font-medium text-xs">{campus.campusName}</TableCell>
                    <TableCell className="text-xs">{campus.contactPerson}</TableCell>
                    <TableCell>
                      {campus.logo ? (
                        <img
                          src={campus.logo}
                          alt={campus.campusName}
                          className="h-10 w-10 object-cover rounded-full border"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No Logo</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`edit-campus/${campus._id}`}>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(campus)}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campus
              {selectedCampus && <span className="font-semibold"> "{selectedCampus.campusName}"</span>} and 
              remove all associated data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}