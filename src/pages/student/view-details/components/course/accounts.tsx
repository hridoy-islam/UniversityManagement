import { Eye, Download, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface AccountsProps {
  student: any;
}

export function Accounts({ student }: AccountsProps) {
  const agreementDetails = {
    date: "1st Mar, 2025 by A T M ASHFIQUR RAHMAN",
    slcCourseCode: "134139",
    selfFunded: "No",
    fees: "£6,000.00",
    noOfClaim: "2",
    claimAmount: "£3,000.00",
    balance: "£0.00",
  };

  const installments = [
    {
      id: "43180-26681",
      date: "1st Mar, 2025",
      term: "2025 January SPR",
      sessionTerm: "Term 1",
      amount: "£1,500.00",
      courseCode: "134139",
    },
    {
      id: "43904-27437",
      date: "30th May, 2025",
      term: "2025 May SUM",
      sessionTerm: "Term 2",
      amount: "£1,500.00",
      courseCode: "134139",
    },
  ];

  const invoices = [
    {
      inv: "1738087177",
      date: "5th Mar, 2025",
      term: "2025 January SPR",
      sessionTerm: "Term 1",
      method: "Bank",
      receivedBy: "MD MASUD REZA KHAN",
      type: "Course Fee",
      amount: "£1,500.00",
    },
    {
      inv: "1738087548",
      date: "4th Jun, 2025",
      term: "2025 May SUM",
      sessionTerm: "Term 2",
      method: "Bank",
      receivedBy: "MD MASUD REZA KHAN",
      type: "Course Fee",
      amount: "£1,500.00",
    },
  ];

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Student Accounts</h2>
      </div>

      {/* Agreement Details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-theme uppercase tracking-wide">
            Agreement Details for Year 1
          </h3>
          <p className="text-xs text-gray-500 mt-1">(13849-9652)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-gray-500">Date</label>
            <p className="mt-1 font-medium text-gray-800">{agreementDetails.date}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">SLC Course Code</label>
            <p className="mt-1 font-medium text-gray-800">{agreementDetails.slcCourseCode}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Self Funded</label>
            <Badge
              variant="secondary"
              className="mt-1 bg-red-100 text-red-800 hover:bg-red-100 text-xs px-2 py-0.5"
            >
              {agreementDetails.selfFunded}
            </Badge>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Fees</label>
            <p className="mt-1 font-medium text-gray-800">{agreementDetails.fees}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">No of Claim</label>
            <p className="mt-1 font-medium text-gray-800">{agreementDetails.noOfClaim}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Claim Amount</label>
            <p className="mt-1 font-medium text-gray-800">{agreementDetails.claimAmount}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="flex justify-end pt-2">
          <div className="text-right">
            <label className="block text-xs font-medium text-gray-500">Balance</label>
            <p className="font-semibold text-theme">{agreementDetails.balance}</p>
          </div>
        </div>
      </div>

      {/* Installments & Invoices */}
      <div className="grid grid-cols-1 gap-6">
        {/* Installments */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-400 pb-1">Installments</h3>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 h-9">
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">#</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Term</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Ses. Term</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Code</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installments.map((inst, index) => (
                    <TableRow
                      key={inst.id}
                      className={index === 0 ? "bg-theme/5" : "hover:bg-gray-50"}
                    >
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inst.id}</TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inst.date}</TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inst.term}</TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inst.sessionTerm}</TableCell>
                      <TableCell className="text-xs font-medium text-gray-800 px-3 py-2">
                        {inst.amount}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600 px-3 py-2">{inst.courseCode}</TableCell>
                      <TableCell className="text-right px-3 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem className="py-1.5 cursor-pointer">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="py-1.5 cursor-pointer">Print Receipt</DropdownMenuItem>
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

        {/* Invoices */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-400 pb-1">Invoices</h3>

          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 h-9">
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Inv.</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Term</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Ses. Term</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Method</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Rec. By</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2">Amount</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 px-3 py-2 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.inv} className="hover:bg-gray-50">
                      <TableCell className="text-xs font-medium text-gray-800 px-3 py-2">
                        {inv.inv}
                      </TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inv.date}</TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inv.term}</TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">{inv.sessionTerm}</TableCell>
                      <TableCell className="text-xs text-gray-600 px-3 py-2">{inv.method}</TableCell>
                      <TableCell className="text-xs text-gray-600 px-3 py-2 truncate max-w-[100px]" title={inv.receivedBy}>
                        {inv.receivedBy}
                      </TableCell>
                      <TableCell className="text-xs text-gray-800 px-3 py-2">
                        <Badge variant="default" className="text-xs">
                          {inv.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-gray-800 px-3 py-2">
                        {inv.amount}
                      </TableCell>
                      <TableCell className="text-right px-3 py-2">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                            title="View Invoice"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-600 hover:text-green-600"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}