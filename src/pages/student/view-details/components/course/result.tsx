import { Button } from "@/components/ui/button";
import { Printer, MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ResultProps {
  student: any;
}

export function Result({ student }: ResultProps) {
  const results = [
    {
      sn: 1,
      id: "72717",
      attendanceTerm: "2025 May",
      module: "The Hospitality Business Toolkit (RQF) - RQF LEVEL 5",
      code: "Y/616/1791",
      awardingBody: "PEARSON",
      publishedDate: "13 Aug 2025, 06:00 PM",
      grade: "P",
      merit: "Pass",
      attempted: "1",
      updatedBy: "AMIR BAKHAT",
    },
    {
      sn: 2,
      id: "72570",
      attendanceTerm: "2025 May",
      module: "Leadership & Management for Service Industries (RQF) - RQF LEVEL 5",
      code: "D/616/1792",
      awardingBody: "PEARSON",
      publishedDate: "13 Aug 2025, 06:00 PM",
      grade: "P",
      merit: "Pass",
      attempted: "1",
      updatedBy: "AMIR BAKHAT",
    },
    {
      sn: 3,
      id: "71780",
      attendanceTerm: "2025 January",
      module: "The Contemporary Hospitality Industry (RQF) - RQF LEVEL 5",
      code: "Y/616/1788",
      awardingBody: "PEARSON",
      publishedDate: "24 Apr 2025, 06:00 PM",
      grade: "P",
      merit: "Pass",
      attempted: "1",
      updatedBy: "ANURADHA BEHCHAND DEHAL",
    },
    {
      sn: 4,
      id: "67818",
      attendanceTerm: "2025 January",
      module: "Managing The Customer Experience (RQF) - RQF LEVEL 5",
      code: "D/616/1789",
      awardingBody: "PEARSON",
      publishedDate: "24 Apr 2025, 06:00 PM",
      grade: "P",
      merit: "Pass",
      attempted: "1",
      updatedBy: "FAROOQ AHSAN NAWAR",
    },
    {
      sn: 5,
      id: "67865",
      attendanceTerm: "2025 January",
      module: "Professional Identity and Practice (RQF) - RQF LEVEL 5",
      code: "R/616/1790",
      awardingBody: "PEARSON",
      publishedDate: "24 Apr 2025, 06:00 PM",
      grade: "P",
      merit: "Pass",
      attempted: "1",
      updatedBy: "FAROOQ AHSAN NAWAR",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Student Results</h2>

        <div className="flex items-center gap-4">
          {/* Status Summary */}
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed: 5
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Outstanding: 0
            </Badge>
            <span>Total: 5</span>
          </div>

          {/* Print Button */}
          <Button size="sm" variant="outline" className="text-xs h-8 gap-1">
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 h-10">
             
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Term
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Module
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Code
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Awarding Body
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Published Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Grade
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Merit
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Attempted
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Updated By
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 text-left px-3 py-2">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.sn}
                  className="hover:bg-gray-50 data-[state=selected]:bg-gray-100"
                >
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.id}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.attendanceTerm}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2 max-w-xs truncate" title={result.module}>
                    {result.module}
                  </TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.code}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.awardingBody}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.publishedDate}</TableCell>
                  <TableCell className="text-xs font-medium text-gray-900 px-3 py-2">{result.grade}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">
                    <Badge variant="default" className="text-xs py-0 px-2">
                      {result.merit}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2">{result.attempted}</TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2 max-w-[120px] truncate" title={result.updatedBy}>
                    {result.updatedBy}
                  </TableCell>
                  <TableCell className="px-3 py-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs bg-white text-black ">
                        <DropdownMenuItem className="cursor-pointer py-1.5">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-1.5">
                          Download Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-1.5 text-red-600">
                          Re-evaluation Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}