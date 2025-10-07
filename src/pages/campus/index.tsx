import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axios";

interface CampusType {
  _id: string;
  campusName: string;
  contactPerson: string;
  logo: string;
}

export default function CampusPage() {
  const [campuses, setCampuses] = useState<CampusType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await axiosInstance.get("/campuses");
        // Assuming your API returns { success, message, data: { result: CampusType[] } }
        const campusData = res.data.data.result;
        setCampuses(campusData);
      } catch (error) {
        console.error("Failed to fetch campuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampuses();
  }, []);

  if (loading) {
    return <p className="text-xs text-center mt-4">Loading campuses...</p>;
  }

  return (
    <div className="text-xs">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-2xl font-bold">Campus Management</CardTitle>
            <CardDescription className="text-xs">
              Manage your campuses, contacts, and logos
            </CardDescription>
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
                <TableHead className="text-right text-xs">Action</TableHead>
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
                  <TableCell className="text-right flex justify-end">
                    <Link to={`edit-campus/${campus._id}`}>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex items-center justify-end gap-2 bg-theme text-white hover:bg-theme/90 text-xs"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
