import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Module = {
  id: number;
  name: string;
  code: string;
  description: string;
};

function CourseModulePage() {
  const { id } = useParams<{ id: string }>(); // course ID
  const navigate = useNavigate();

  // Mock data - in real app, this would come from an API
  const [modules] = React.useState<Module[]>([
    { id: 1, name: "Intro to React", code: "REACT101", description: "Basics of React.js" },
    { id: 2, name: "Advanced JS", code: "JS202", description: "Deep dive into JavaScript" },
  ]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Course Modules</CardTitle>
        <Button
          size="sm"
          onClick={() => navigate(`new`)}
        >
          Add Module
        </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module Name</TableHead>
              <TableHead>Module Code</TableHead>
              <TableHead>Module Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length > 0 ? (
              modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>{module.code}</TableCell>
                  <TableCell className="text-gray-600">{module.description}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`${module.id}`)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                  No modules added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CourseModulePage;