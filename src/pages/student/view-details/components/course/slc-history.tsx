import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SLCHistoryProps {
  student: any;
}

// Mock Data: Multi-Year SLC History
const slcHistoryData = [
  {
    year: "Year 1",
    registration: {
      id: "9652",
      academicYear: "2024/25",
      confirmationDate: "1st Mar, 2025 by A T M ASHFIQUR RAHMAN",
      registrationConfirmation: "Yes",
    },
    specifiedAttendances: [
      {
        id: "26681",
        confirmationDate: "1st Mar, 2025",
        attendanceSemester: "2025 January - Spring Term",
        sessionTerm: "Term 1",
        code: "A",
        note: "",
        coc: "",
      },
      {
        id: "27437",
        confirmationDate: "30th May, 2025",
        attendanceSemester: "2025 May - Summer Term",
        sessionTerm: "Term 2",
        code: "A",
        note: "",
        coc: "",
      },
    ],
    unspecifiedAttendances: [],
    unspecifiedCOC: [],
  },
  {
    year: "Year 2",
    registration: {
      id: "10341",
      academicYear: "2025/26",
      confirmationDate: "15th Sep, 2025 by NUSRAT JAHAN",
      registrationConfirmation: "Yes",
    },
    specifiedAttendances: [
      {
        id: "28901",
        confirmationDate: "15th Sep, 2025",
        attendanceSemester: "2025 September - Fall Term",
        sessionTerm: "Term 1",
        code: "B",
        note: "Late registration approved",
        coc: "",
      },
      {
        id: "29120",
        confirmationDate: "10th Jan, 2026",
        attendanceSemester: "2026 January - Winter Term",
        sessionTerm: "Term 2",
        code: "B",
        note: "",
        coc: "",
      },
    ],
    unspecifiedAttendances: [
      {
        id: "29500",
        confirmationDate: "5th Feb, 2026",
        attendanceSemester: "2026 February",
        sessionTerm: "Term 2",
        code: "U",
        note: "Pending review",
      },
    ],
    unspecifiedCOC: [
      {
        id: "COC7712",
        confirmationDate: "12th Jan, 2026",
        type: "Attendance Waiver",
        reason: "Medical Leave",
        actioned: "Approved",
        submittedBy: "Dr. Sarah Williams",
        documents: "2",
      },
    ],
  },
];

export function SLCHistory({ student }: SLCHistoryProps) {
  return (
    <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Page Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">SLC History</h2>
        <p className="text-xs text-gray-600 mt-1">Student ID: SFDU24530034W</p>
      </div>

      {/* Loop Through Years */}
      {slcHistoryData.map((yearData) => (
        <div key={yearData.year} className="space-y-5 border-b border-gray-100 pb-6 last:border-b-0">
          {/* Year Header */}
          <div>
            <h3 className="text-sm font-semibold text-theme uppercase tracking-wide">
              {yearData.year} - {yearData.registration.academicYear}
            </h3>
          </div>

          {/* Registration Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-gray-500">#ID</label>
              <p className="mt-1 font-medium text-gray-800">{yearData.registration.id}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Academic Year</label>
              <p className="mt-1 font-medium text-gray-800">{yearData.registration.academicYear}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Confirmation Date</label>
              <p className="mt-1 font-medium text-gray-800">{yearData.registration.confirmationDate}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Registration Confirmed</label>
              <Badge
                className="mt-1 bg-green-100 text-green-800 hover:bg-green-100 text-xs px-2 py-1"
              >
                {yearData.registration.registrationConfirmation}
              </Badge>
            </div>
          </div>

          {/* Specified Attendances */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-700 border-b border-gray-300 pb-1">
              Specified Attendances
            </h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 h-9">
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">ID</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Confirmed On</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Semester</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Term</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Code</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Note</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">COC</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearData.specifiedAttendances.length > 0 ? (
                      yearData.specifiedAttendances.map((att) => (
                        <TableRow key={att.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.id}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.confirmationDate}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2 truncate max-w-[150px]" title={att.attendanceSemester}>
                            {att.attendanceSemester}
                          </TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.sessionTerm}</TableCell>
                          <TableCell className="text-xs px-3 py-2">
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-sm">
                              {att.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 px-3 py-2">{att.note || "-"}</TableCell>
                          <TableCell className="text-xs text-gray-600 px-3 py-2">{att.coc || "-"}</TableCell>
                          <TableCell className="text-right px-3 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem className="py-1.5 cursor-pointer">View Details</DropdownMenuItem>
                                <DropdownMenuItem className="py-1.5 cursor-pointer">Edit</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="px-3 py-4 text-center text-xs text-gray-500">
                          No specified attendance records.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Unspecified Attendances */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-700 border-b border-gray-300 pb-1">
              Unspecified Attendances
            </h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 h-9">
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">ID</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Confirmed On</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Semester</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Term</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Code</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Note</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearData.unspecifiedAttendances.length > 0 ? (
                      yearData.unspecifiedAttendances.map((att) => (
                        <TableRow key={att.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.id}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.confirmationDate}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2 truncate">{att.attendanceSemester}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{att.sessionTerm}</TableCell>
                          <TableCell className="text-xs px-3 py-2">
                            <Badge className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-sm">
                              {att.code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 px-3 py-2">{att.note || "-"}</TableCell>
                          <TableCell className="text-right px-3 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem className="py-1.5 cursor-pointer">View</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="px-3 py-4 text-center text-xs text-gray-500">
                          No unspecified attendance records.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Unspecified COC */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-700 border-b border-gray-300 pb-1">
              Unspecified COC
            </h4>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 h-9">
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">ID</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Confirmed On</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Type</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Reason</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Actioned</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Submitted By</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Documents</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearData.unspecifiedCOC.length > 0 ? (
                      yearData.unspecifiedCOC.map((coc) => (
                        <TableRow key={coc.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{coc.id}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">{coc.confirmationDate}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2">
                            <Badge variant="default" className="text-xs">
                              {coc.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 px-3 py-2">{coc.reason}</TableCell>
                          <TableCell className="text-xs text-green-700 font-medium px-3 py-2">{coc.actioned}</TableCell>
                          <TableCell className="text-xs text-gray-800 px-3 py-2 truncate max-w-[120px]" title={coc.submittedBy}>
                            {coc.submittedBy}
                          </TableCell>
                          <TableCell className="text-xs text-blue-600 underline px-3 py-2 cursor-pointer">
                            {coc.documents} File(s)
                          </TableCell>
                          <TableCell className="text-right px-3 py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                <DropdownMenuItem className="py-1.5 cursor-pointer">View Document</DropdownMenuItem>
                                <DropdownMenuItem className="py-1.5 cursor-pointer text-red-600">Revoke</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="px-3 py-6 text-center text-xs text-gray-500">
                          Unspecified COC history not found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}