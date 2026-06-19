import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axiosInstance from "@/lib/axios";
import moment from "@/lib/moment-setup";
import Select from "react-select";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Send, Search, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

// --- React Select Custom Styles ---
const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '36px',
    fontSize: '14px',
    borderRadius: '0.375rem',
    borderColor: state.isFocused ? '#000' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 1px #000' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#000' : '#d1d5db'
    }
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '0 12px',
  }),
  input: (base: any) => ({
    ...base,
    margin: '0',
    padding: '0',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af'
  }),
  menu: (base: any) => ({
    ...base,
    fontSize: '14px',
    zIndex: 50
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#0f172a' // Slate-900 (matches generic shadcn themes)
      : state.isFocused
      ? '#f1f5f9' // Slate-100
      : 'white',
    color: state.isSelected ? 'white' : '#0f172a',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#0f172a' : '#e2e8f0'
    }
  }),
  indicatorSeparator: () => ({ display: 'none' }),
};

// Form Validation Schema
const formSchema = z.object({
  emailConfigId: z.string().min(1, "Sender configuration is required"),
  emailDraft: z.string().optional(),
  offerType: z.enum(["conditional", "unconditional"], {
    required_error: "Offer type is required",
  }),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

interface CommunicationPageProps {
  student: any;
}

export default function OfferPage({ student }: CommunicationPageProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<any[]>([]);
  const [emailDrafts, setEmailDrafts] = useState<any[]>([]);
  const { appId } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
const { user } = useSelector((state: any) => state.auth);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailConfigId: "",
      emailDraft: "",
      offerType: undefined, // Enum validation handles this
      subject: "",
      body: "",
    },
  });

  // Fetch Emails, Configs, and Drafts
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logsRes, configsRes, draftsRes] = await Promise.all([
        axiosInstance.get("/email?limit=all", { params: { userId: student?._id, applicationId: appId,emailType: 'offerletter' } }),
        axiosInstance.get("/email-configs?limit=all"),
        axiosInstance.get("/email-drafts?limit=all"),
      ]);

      setLogs(logsRes.data?.data?.result || logsRes.data?.data || []);
      setEmailConfigs(configsRes.data?.data?.result || []);
      setEmailDrafts(draftsRes.data?.data?.result || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch communication data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (student?._id) {
      fetchData();
    }
  }, [student?._id]);

  // Handle template selection to auto-fill subject and body
  const handleDraftChange = (emailDraft: string) => {
    const selectedDraft = emailDrafts.find((draft) => draft._id === emailDraft);
    if (selectedDraft) {
      form.setValue("subject", selectedDraft.subject || "");
      form.setValue("body", selectedDraft.body || "");
      form.setValue("emailDraft", emailDraft);
    }
  };

  // Submit new email/offer
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const payload = {
        emailConfigId: values.emailConfigId,
        subject: values.subject,
        body: values.body,
        userId: student._id,
        issuedBy:user._id,
        emailType: "offerletter",
        applicationId: appId,
        offerType: values.offerType, // Added missing comma here
        ...(values.emailDraft && { emailDraft: values.emailDraft }),
      };

      await axiosInstance.post("/email", payload);
      
      toast({ title: "Success", description: "Email sent successfully." });
      setIsDialogOpen(false);
      form.reset();
      fetchData(); // Refresh logs
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter logs based on search and status
  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emailConfigId?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      sent: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };
    return <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>{status}</Badge>;
  };

  // Mapping Options for React-Select
  const emailConfigOptions = emailConfigs.map((config) => ({
    value: config._id,
    label: config.email,
  }));

  const draftOptions = emailDrafts.map((draft) => ({
    value: draft._id,
    label: draft.subject,
  }));

  const offerTypeOptions = [
    { value: "conditional", label: "Conditional" },
    { value: "unconditional", label: "Unconditional" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "sent", label: "Sent" },
  ];

  return (
    <div className="space-y-6 text-sm">
      {/* Action Buttons & Dialog */}
      <div className="flex justify-end gap-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-theme hover:bg-theme/90 text-white">
              <FileText className="mr-2 h-4 w-4" />
              Send Offer Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Send Communication</DialogTitle>
              <DialogDescription>
                Compose and send an offer letter or email to {student?.email}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emailConfigId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From (Sender Config) <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={emailConfigOptions}
                            value={emailConfigOptions.find(opt => opt.value === field.value) || null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Select sender email"
                            styles={customSelectStyles}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="offerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer Type <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select
                            options={offerTypeOptions}
                            value={offerTypeOptions.find(opt => opt.value === field.value) || null}
                            onChange={(option: any) => field.onChange(option?.value || "")}
                            placeholder="Select offer type"
                            styles={customSelectStyles}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailDraft"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template / Draft</FormLabel>
                        <FormControl>
                          <Select
                            options={draftOptions}
                            value={draftOptions.find(opt => opt.value === field.value) || null}
                            onChange={(option: any) => {
                              const val = option?.value || "";
                              field.onChange(val);
                              handleDraftChange(val);
                            }}
                            placeholder="Select a template"
                            isClearable
                            styles={customSelectStyles}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter email content"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-theme text-white hover:bg-theme/90">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isSubmitting ? "Sending..." : "Send Email"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Communication Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Letter Log</CardTitle>
          {/* <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by subject or sender..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-40">
              <Select
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === statusFilter)}
                onChange={(option: any) => setStatusFilter(option?.value || "all")}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>
          </div> */}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No communications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="font-medium">
                        {log.emailConfigId?.email || "Unknown Sender"}
                      </TableCell>
                      <TableCell>{log.subject}</TableCell>
                      <TableCell className="capitalize">{log.emailType || "N/A"}</TableCell>
                      <TableCell>
                        {log.createdAt
                          ? moment(log.createdAt).tz("Europe/London").format("MMM D, YYYY, h:mm A")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Log Details Viewer Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-[100px_1fr] gap-2 border-b pb-4">
                <span className="font-semibold text-gray-500">From:</span>
                <span>{selectedLog?.emailConfigId?.email}</span>
                
                <span className="font-semibold text-gray-500">To:</span>
                <span>{student?.email}</span>
                
                <span className="font-semibold text-gray-500">Status:</span>
                <span>{getStatusBadge(selectedLog.status)}</span>
                
                <span className="font-semibold text-gray-500">Date:</span>
                <span>{moment(selectedLog.createdAt).format("MMM D, YYYY, h:mm A")}</span>
                
                <span className="font-semibold text-gray-500">Subject:</span>
                <span className="font-medium">{selectedLog?.subject}</span>

                {/* Optional: Add Offer Type Display to Logs if needed */}
                {selectedLog?.offerType && (
                  <>
                    <span className="font-semibold text-gray-500">Offer Type:</span>
                    <span className="capitalize">{selectedLog.offerType}</span>
                  </>
                )}
              </div>
              <div>
                <span className="font-semibold text-gray-500 block mb-2">Message Body:</span>
                <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap text-gray-700">
                  {selectedLog?.body}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  ); 
}