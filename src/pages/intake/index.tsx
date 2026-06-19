import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";
import { BlinkingDots } from "@/components/shared/blinking-dots";
import { DynamicPagination } from "@/components/shared/DynamicPagination";
import { Switch } from "@/components/ui/switch";
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
import moment from "@/lib/moment-setup";

interface IntakeType {
  _id: string;
  termName: string;
  validTillDate: string;
  status: number; // 0 or 1
}

export default function IntakePage() {
  const [intakes, setIntakes] = useState<IntakeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIntake, setSelectedIntake] = useState<IntakeType | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchIntakes = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      const res = await axiosInstance.get("/terms", { params });
      const intakeData = res.data.data.result;
      setTotalPages(res.data.data.meta.totalPage || 1);
      setIntakes(intakeData);
    } catch (error) {
      console.error("Failed to fetch intakes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch intakes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntakes(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleStatusChange = async (intakeId: string, newStatus: number) => {
    // Optimistically update the UI
    setIntakes(prevIntakes =>
      prevIntakes.map(intake =>
        intake._id === intakeId ? { ...intake, status: newStatus } : intake
      )
    );

    try {
      await axiosInstance.patch(`/terms/${intakeId}`, {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: `Status updated successfully.`,
      });
    } catch (error) {
      // Revert the status if the API call fails
      setIntakes(prevIntakes =>
        prevIntakes.map(intake =>
          intake._id === intakeId ? { ...intake, status: newStatus === 1 ? 0 : 1 } : intake
        )
      );
      
      console.error("Failed to update status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (intake: IntakeType) => {
    setSelectedIntake(intake);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIntake) return;
    
    setDeleting(true);
    try {
      await axiosInstance.delete(`/terms/${selectedIntake._id}`);

      // Remove from local state
      setIntakes(prevIntakes => {
        const updatedIntakes = prevIntakes.filter(intake => intake._id !== selectedIntake._id);
        
        // If current page is now empty and it's not the first page, go to previous page
        if (updatedIntakes.length === 0 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        
        return updatedIntakes;
      });
      
      toast({
        title: "Success",
        description: `${selectedIntake.termName} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setSelectedIntake(null);
    } catch (error) {
      console.error("Failed to delete intake:", error);
      toast({
        title: "Error",
        description: "Failed to delete intake. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">
        Inactive
      </Badge>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Intake Management</CardTitle>
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Intake
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
  if (intakes.length === 0) {
    return (
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Intake Management</CardTitle>
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Intake
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No intakes found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first intake
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
              <CardTitle className="text-2xl font-bold">Intake Management</CardTitle>
            </div>
            <Link to="add">
              <Button className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90">
                <Plus className="h-4 w-4" />
                Add Intake
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Intake</TableHead>
                  <TableHead className="text-xs">Valid Till</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intakes.map((intake) => (
                  <TableRow key={intake._id}>
                    <TableCell className="font-medium text-xs">{intake.termName}</TableCell>
                    <TableCell className="text-xs">
                      {intake.validTillDate ? moment(intake.validTillDate).format("DD/MM/YYYY") : "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={intake.status === 1}
                          onCheckedChange={(checked) => 
                            handleStatusChange(intake._id, checked ? 1 : 0)
                          }
                        />
                        {getStatusBadge(intake.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`edit-intake/${intake._id}`}>
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
                          onClick={() => handleDeleteClick(intake)}
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
              This action cannot be undone. This will permanently delete the intake
              {selectedIntake && <span className="font-semibold"> "{selectedIntake.termName}"</span>} and 
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