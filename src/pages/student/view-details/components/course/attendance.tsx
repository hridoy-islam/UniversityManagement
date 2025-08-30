import { Button } from "@/components/ui/button";
import { Printer, MoreHorizontal, Eye } from "lucide-react";
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

interface AttendanceProps {
  student: any;
}

export function Attendance({ student }: AttendanceProps) {
  const attendanceData = {
    period: "2025 January",
    percentage: "89.04%",
    dateRange: "20 Jan 2025 - 04 Apr 2025",
    lastAttendance: "Last Attendance: 3rd April, 2025",
    stats: "P: 43, A: 8, O: 20, M: 2",
    totalClasses: "Total: 73 days",
  };

  const sessions = [
    {
      id: 1,
      title: "GROUP TUTORIAL (RQF)",
      code: "3693",
      time: "12:00 PM - 02:00 PM",
      date: "JAN25-HM-I",
      location: "Barking-Blue-Room",
      attendance: "100.00%",
      status: "Present",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 2,
      title: "The Contemporary Hospitality Industry (RQF)-Y/616/1788",
      code: "3696",
      time: "09:45 AM - 11:45 AM",
      date: "JAN25-HM-I",
      location: "Barking-Blue-Room",
      attendance: "100.00%",
      status: "Present",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 3,
      title: "Professional Identity and Practice (RQF)-R/616/1790",
      code: "3690",
      time: "09:45 AM - 11:45 AM",
      date: "JAN25-HM-I",
      location: "Barking-Blue-Room",
      attendance: "72.73%",
      status: "Late",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 4,
      title: "Managing The Customer Experience (RQF)-D/616/1789",
      code: "3691",
      time: "12:00 PM - 02:00 PM",
      date: "JAN25-HM-I",
      location: "Barking-Blue-Room",
      attendance: "81.82%",
      status: "Present",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 5,
      title: "The Contemporary Hospitality Industry (RQF)-Y/616/1788",
      code: "3692",
      time: "02:15 PM - 04:15 PM",
      date: "JAN25-HM-I",
      location: "Barking-Blue-Room",
      attendance: "72.73%",
      status: "Late",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 6,
      title: "Managing The Customer Experience (RQF)-D/616/1789",
      code: "3694",
      time: "09:45 AM - 11:45 AM",
      date: "JAN25-HM-I",
      location: "Online",
      attendance: "100.00%",
      status: "Present",
      tutor: "RAKHA HOSSAIN DRIST",
    },
    {
      id: 7,
      title: "Professional Identity and Practice (RQF)-R/616/1790",
      code: "3695",
      time: "12:00 PM - 02:00 PM",
      date: "JAN25-HM-I",
      location: "Online",
      attendance: "100.00%",
      status: "Present",
      tutor: "RAKHA HOSSAIN DRIST",
    },
  ];

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Current Term Banner */}
      <div className="bg-theme text-white p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">Current Term: {attendanceData.period}</h3>
            <p className="text-xs opacity-90 mt-1">
              {attendanceData.dateRange} • {attendanceData.stats} • {attendanceData.totalClasses}
            </p>
            <p className="text-xs opacity-90">{attendanceData.lastAttendance}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-white bg-opacity-20">
              Overall: {attendanceData.percentage}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="default"
                  variant="ghost"
                  className="text-white border-white/50 hover:bg-white hover:text-theme text-xs h-8 px-2"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs bg-white text-black border-gray-300">
                <DropdownMenuItem className="py-1.5 cursor-pointer">Export Data</DropdownMenuItem>
                <DropdownMenuItem className="py-1.5 cursor-pointer">Attendance Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="text-white border-white/50 hover:bg-black/80  text-xs h-8 px-2 gap-1"
            >
              <Printer className="h-3 w-3" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 h-9">
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">S/N</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Module</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Code</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Time</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Date</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Location</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Tutor</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-center">Attendance</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow
                  key={session.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="text-xs text-gray-800 px-3 py-2 font-medium">{session.id}</TableCell>
                  <TableCell className="text-xs text-gray-800 px-3 py-2 max-w-xs truncate" title={session.title}>
                    {session.title}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2 font-mono">{session.code}</TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2">{session.time}</TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2">{session.date}</TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2">
                    <span className={`inline-block w-2 h-2 rounded-full bg-${session.location === 'Online' ? 'blue' : 'gray'}-500 mr-1.5 align-middle`}></span>
                    {session.location}
                  </TableCell>
                  <TableCell className="text-xs text-gray-600 px-3 py-2 truncate max-w-[120px]" title={session.tutor}>
                    {session.tutor}
                  </TableCell>
                  <TableCell className="text-xs px-3 py-2 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-white text-xs font-medium ${
                        session.attendance === "100.00%" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {session.attendance}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-3 py-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
                      title="View Session Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
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