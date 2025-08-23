import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Building2, GraduationCap, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data: Universities with Campuses, Courses, Intakes
const mockUniversities = [
  {
    id: 1,
    name: 'University of Manchester',
    abbreviation: 'UoM',
    established: 1824,
    totalCampuses: 3,
    totalCourses: 142,
    activeIntakes: 4,
    status: 'Active',
    country: 'United Kingdom',
    website: 'https://www.manchester.ac.uk'
  },
  {
    id: 2,
    name: 'London School of Economics',
    abbreviation: 'LSE',
    established: 1895,
    totalCampuses: 2,
    totalCourses: 89,
    activeIntakes: 3,
    status: 'Active',
    country: 'United Kingdom',
    website: 'https://www.lse.ac.uk'
  },
  {
    id: 3,
    name: 'University of Birmingham',
    abbreviation: 'UoB',
    established: 1900,
    totalCampuses: 2,
    totalCourses: 67,
    activeIntakes: 2,
    status: 'Inactive',
    country: 'United Kingdom',
    website: 'https://www.birmingham.ac.uk'
  }
];

export default function UniversityPage() {
  const [universities] = useState(mockUniversities);

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-2 py-1 text-xs font-medium">
        {status}
      </Badge>
    ) : (
      <Badge variant="secondary" className="px-2 py-1 text-xs font-medium">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6  text-xs">
      {/* Page Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-2xl font-bold">University Management</CardTitle>
            </div>
            <CardDescription className="text-xs mt-1">
              Manage universities, campuses, courses, and intakes across your institution
            </CardDescription>
          </div>
          <Link to="add">
            <Button className="flex items-center gap-2 bg-theme text-white hover:bg-theme/90 text-xs h-8 px-3">
              <Plus className="h-4 w-4" />
              Add University
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-semibold">University</TableHead>
                  <TableHead className="text-xs font-semibold">Campuses</TableHead>
                  <TableHead className="text-xs font-semibold">Courses</TableHead>
                  <TableHead className="text-xs font-semibold">Intakes</TableHead>
                  <TableHead className="text-xs font-semibold">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-sm text-muted-foreground">
                      No universities found.{' '}
                      <Link to="add" className="text-theme hover:underline">
                        Create one
                      </Link>
                      .
                    </TableCell>
                  </TableRow>
                ) : (
                  universities.map((uni) => (
                    <TableRow key={uni.id} className="transition-colors hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{uni.name}</div>
                          <div className="text-xs text-gray-500">{uni.abbreviation} • Est. {uni.established}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3 text-gray-400" />
                          {uni.totalCampuses}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <GraduationCap className="h-3 w-3 text-gray-400" />
                          {uni.totalCourses}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {uni.activeIntakes}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(uni.status)}</TableCell>
                      <TableCell className="text-right flex justify-end">
                        <Link to={`edit/${uni.id}`}>
                                               <Button variant="default" size="sm" className="flex items-center justify-end gap-2 bg-theme text-white hover:bg-theme/90 text-xs">

                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

         
        </CardContent>
      </Card>
    </div>
  );
}