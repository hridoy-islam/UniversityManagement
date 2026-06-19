import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Loader2, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface AwardingBodyType {
  _id: string;
  name: string;
  status: string; // 1 for active, 0 for inactive
}

export default function AwardingBodyPage() {
  const [awardingBodies, setAwardingBodies] = useState<AwardingBodyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBody, setSelectedBody] = useState<AwardingBodyType | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [saving, setSaving] = useState(false);
  
  // Delete states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteBody, setSelectedDeleteBody] = useState<AwardingBodyType | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  const { toast } = useToast();

  const fetchAwardingBodies = async (page = 1, limit = entriesPerPage) => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      const res = await axiosInstance.get("/awarding-body", { params });
      const data = res.data.data.result;
      setTotalPages(res.data.data.meta?.totalPage || 1);
      setAwardingBodies(data);
    } catch (error) {
      console.error("Failed to fetch awarding bodies:", error);
      toast({
        title: "Error",
        description: "Failed to fetch awarding bodies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwardingBodies(currentPage, entriesPerPage);
  }, [currentPage, entriesPerPage]);

  const handleStatusChange = async (bodyId: string, newStatus: number) => {
    // Optimistically update the UI
    setAwardingBodies(prevBodies =>
      prevBodies.map(body =>
        body._id === bodyId ? { ...body, status: newStatus } : body
      )
    );

    try {
      await axiosInstance.patch(`/awarding-body/${bodyId}`, {
        status: newStatus,
      });
      
      toast({
        title: "Success",
        description: `Status updated successfully.`,
      });
    } catch (error) {
      // Revert the status if the API call fails
      setAwardingBodies(prevBodies =>
        prevBodies.map(body =>
          body._id === bodyId ? { ...body, status: newStatus === 'active' ? 'inactive' : 'active' } : body
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

  const handleAddNew = () => {
    setIsEditing(false);
    setSelectedBody(null);
    setFormData({ name: "" });
    setDialogOpen(true);
  };

  const handleEdit = (body: AwardingBodyType) => {
    setIsEditing(true);
    setSelectedBody(body);
    setFormData({ name: body.name });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setFormData({ name: "" });
    setSelectedBody(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Awarding body name is required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (isEditing && selectedBody) {
        // Update existing
        await axiosInstance.patch(`/awarding-body/${selectedBody._id}`, {
          name: formData.name.trim(),
        });
        
        setAwardingBodies(prevBodies =>
          prevBodies.map(body =>
            body._id === selectedBody._id
              ? { ...body, name: formData.name.trim() }
              : body
          )
        );
        
        toast({
          title: "Success",
          description: "Awarding body updated successfully.",
        });
      } else {
        // Create new
        const res = await axiosInstance.post("/awarding-body", {
          name: formData.name.trim(),
          status: 'active',
        });
        
        const newBody = res.data.data;
        setAwardingBodies(prevBodies => [newBody, ...prevBodies]);
        
        toast({
          title: "Success",
          description: "Awarding body created successfully.",
        });
      }
      
      handleDialogClose();
    } catch (error: any) {
      console.error("Failed to save awarding body:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save awarding body. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (body: AwardingBodyType) => {
    setSelectedDeleteBody(body);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDeleteBody) return;
    
    setDeleting(true);
    try {
      await axiosInstance.delete(`/awarding-body/${selectedDeleteBody._id}`);

      // Remove from local state
      setAwardingBodies(prevBodies => {
        const updatedBodies = prevBodies.filter(body => body._id !== selectedDeleteBody._id);
        
        // If current page is now empty and it's not the first page, go to previous page
        if (updatedBodies.length === 0 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
        
        return updatedBodies;
      });
      
      toast({
        title: "Success",
        description: `${selectedDeleteBody.name} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setSelectedDeleteBody(null);
    } catch (error) {
      console.error("Failed to delete awarding body:", error);
      toast({
        title: "Error",
        description: "Failed to delete awarding body. Please try again.",
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
              <CardTitle className="text-2xl font-bold">Awarding Body</CardTitle>
            </div>
            <Button 
              onClick={handleAddNew}
              className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
            >
              <Plus className="h-4 w-4" />
              Add Awarding Body
            </Button>
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
  if (awardingBodies.length === 0) {
    return (
      <>
        <div className="text-xs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-2xl font-bold">Awarding Body Management</CardTitle>
              </div>
              <Button 
                onClick={handleAddNew}
                className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
              >
                <Plus className="h-4 w-4" />
                Add Awarding Body
              </Button>
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
                  No awarding bodies found
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first awarding body
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {isEditing ? "Edit Awarding Body" : "Add Awarding Body"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditing 
                  ? "Update the awarding body details below."
                  : "Enter the details for the new awarding body."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-4 py-4">
              <div className="w-full">
                <Label htmlFor="name" className="text-right text-xs">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="col-span-3 text-xs"
                  placeholder="Enter awarding body name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleDialogClose}
                disabled={saving}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="text-xs bg-theme text-white hover:bg-theme/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update" : "Create"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Show table with data
  return (
    <>
      <div className="text-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold">Awarding Body</CardTitle>
            </div>
            <Button 
              onClick={handleAddNew}
              className="flex items-center gap-2 text-xs bg-theme text-white hover:bg-theme/90"
            >
              <Plus className="h-4 w-4" />
              Add Awarding Body
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Awarding Body Name</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awardingBodies.map((body) => (
                  <TableRow key={body._id}>
                    <TableCell className="font-medium text-xs">{body.name}</TableCell>
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={body.status === 'active'}
                          onCheckedChange={(checked) => 
                            handleStatusChange(body._id, checked ? 'active' : 'inactive')
                          }
                        />
                        {getStatusBadge(body.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEdit(body)}
                          className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(body)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {isEditing ? "Edit Awarding Body" : "Add Awarding Body"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {isEditing 
                ? "Update the awarding body details below."
                : "Enter the details for the new awarding body."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className=" items-center gap-4">
              <Label htmlFor="name" className="text-right text-xs">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                className="col-span-3 text-xs"
                placeholder="Enter awarding body name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              disabled={saving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-xs bg-theme text-white hover:bg-theme/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the awarding body
              {selectedDeleteBody && <span className="font-semibold"> "{selectedDeleteBody.name}"</span>} and 
              remove all associated data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
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