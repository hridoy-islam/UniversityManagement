import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Plus } from "lucide-react"
import { Link } from "react-router-dom"

// Mock data for campuses
const mockCampuses = [
  {
    id: 1,
    name: "Watney College, Nelson Street",
    contactPerson: "John Smith",
    logo: "https://via.placeholder.com/60x60.png?text=Watney",
  },
  {
    id: 2,
    name: "Downtown Campus",
    contactPerson: "Sarah Johnson",
    logo: "https://via.placeholder.com/60x60.png?text=Downtown",
  },
  {
    id: 3,
    name: "Riverside Campus",
    contactPerson: "Michael Brown",
    logo: "https://via.placeholder.com/60x60.png?text=Riverside",
  },
]

export default function CampusPage() {
  const [campuses] = useState(mockCampuses)

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
                <TableRow key={campus.id}>
                  <TableCell className="font-medium text-xs">{campus.name}</TableCell>
                  <TableCell className="text-xs">{campus.contactPerson}</TableCell>
                  <TableCell>
                    <img
                      src={campus.logo}
                      alt={campus.name}
                      className="h-10 w-10 object-cover rounded-full border"
                    />
                  </TableCell>
                  <TableCell className="text-right flex justify-end">
                    <Link to={`edit-campus/${campus.id}`}>
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
  )
}
