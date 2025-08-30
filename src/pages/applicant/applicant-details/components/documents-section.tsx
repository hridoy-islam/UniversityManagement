import { useEffect, useState } from "react";
import { Eye, Plus, Trash2, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentDialog } from "./document-dialog";
import { Link } from "react-router-dom";

export default function DocumentsSectionMock() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  // Load mock data initially
  useEffect(() => {
    const mockDocs = [
      {
        _id: "1",
        file_type: "Passport",
        checked: "Yes",
        uploadedBy: "Admin",
        uploadDate: "2025-08-30",
        fileUrl: "https://example.com/passport.pdf",
      },
      {
        _id: "2",
        file_type: "Transcript",
        checked: "No",
        uploadedBy: "Student",
        uploadDate: "2025-08-28",
        fileUrl: "https://example.com/transcript.pdf",
      },
      {
        _id: "3",
        file_type: "CV",
        checked: "Yes",
        uploadedBy: "Admin",
        uploadDate: "2025-08-25",
        fileUrl: "https://example.com/cv.pdf",
      },
    ];
    setDocuments(mockDocs);
  }, []);

  // Handle document upload (mock)
  const handleUpload = () => {
    const newDoc = {
      _id: String(documents.length + 1),
      file_type: "New File",
      checked: "No",
      uploadedBy: "Student",
      uploadDate: new Date().toISOString().slice(0, 10),
      fileUrl: "https://example.com/new-file.pdf",
    };
    setDocuments([...documents, newDoc]);
    setDialogOpen(false);
  };

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setDeleteDialog(id);
  };

  const cancelDelete = () => {
    setDeleteDialog(null);
  };

  const performDelete = () => {
    setDocuments(documents.filter((doc) => doc._id !== deleteDialog));
    setDeleteDialog(null);
  };

  // Filter documents
  const filteredDocuments =
    documents.filter((doc) => {
      const matchesQuery = doc.file_type
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus =
        status === "All" ||
        (status === "Active" && doc.checked === "Yes") ||
        (status === "Inactive" && doc.checked !== "Yes");
      return matchesQuery && matchesStatus;
    }) || [];

  return (
    <div className="space-y-4 rounded-md p-4 shadow-sm border border-gray-300  bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            className="bg-theme text-white hover:bg-theme"
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
            <TableHead>Name</TableHead>
            <TableHead>Checked</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDocuments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                No documents found
              </TableCell>
            </TableRow>
          ) : (
            filteredDocuments.map((doc) => (
              <TableRow
                key={doc._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="font-medium">{doc.file_type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      doc.checked === "Yes"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {doc.checked}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{doc.uploadedBy}</div>
                  <div className="text-xs text-gray-500">{doc.uploadDate}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:bg-blue-700"
                    >
                      <Link
                        to={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-700"
                      onClick={() => confirmDelete(doc._id)}
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
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this document?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={performDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document Dialog (mock submission just adds a new record) */}
      <DocumentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleUpload}
        entityId="mock-student-123"
      />
    </div>
  );
}
