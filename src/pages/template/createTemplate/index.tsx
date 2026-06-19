import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Copy, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axiosInstance from '@/lib/axios';

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required')
});

const AVAILABLE_VARIABLES = [
  'todayDate',
  'courseName',
  'intake',
  'applicationStatus',
  'applicationDate',
  'name',
  'title',
  'firstName',
  'lastName',
  'phone',
  'email',
  'countryOfBirth',
  'nationality',
  'countryOfResidence',
  'dateOfBirth',
  'ethnicity',
  'gender',
  'postalAddressLine1',
  'postalAddressLine2',
  'postalCity',
  'postalCountry',
  'postalPostCode',
  'residentialAddressLine1',
  'residentialAddressLine2',
  'residentialCity',
  'residentialCountry',
  'residentialPostCode',
  'emergencyAddress',
  'emergencyContactNumber',
  'emergencyEmail',
  'emergencyFullName',
  'emergencyRelationship',
  'admin',
  'adminEmail',
  'studentId',
  'offerlink'
];

const EXAMPLE_VALUES: Record<string, string> = {
  name: 'John Doe',
  title: 'Mr',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+44 7700 900123',
  email: 'john.doe@example.com',
  countryOfBirth: 'UK',
  nationality: 'British',
  countryOfResidence: 'UK',
  dateOfBirth: '1992-08-21',
  ethnicity: 'Caucasian',
  gender: 'Male',
  postalAddressLine1: '221B Baker Street',
  postalAddressLine2: '',
  postalCity: 'London',
  postalCountry: 'UK',
  postalPostCode: 'NW1 6XE',
  residentialAddressLine1: '10 Downing St',
  residentialAddressLine2: '',
  residentialCity: 'London',
  residentialCountry: 'UK',
  residentialPostCode: 'SW1A 2AA',
  emergencyAddress: '5 Fleet Street, London, UK',
  emergencyContactNumber: '+44 7700 900456',
  emergencyEmail: 'emergency.contact@example.com',
  emergencyFullName: 'Jane Doe',
  emergencyRelationship: 'Sister',
  admin: 'Example College',
  adminEmail: 'info@examplecollege.ac.uk',
  courseName: 'Computer Science Masters',
  intake: 'January 2026',
  applicationStatus: 'pending',
  applicationDate: '2025-09-01',
  'courseCode="ENG23"': '[courseCode="ENG231"] Represents the course with code ENG23',
  'signature id="1"': '[signature id="1"] Represents the signature with ID 1',
  todayDate: '2025-06-01 Represents the current date',
  studentId: 'WC250603001',
  offerlink: 'https://www.watneycollege.co.uk'
};

const DYNAMIC_VARIABLES = ['signature id="1"', 'courseCode="ENG23"'];

type FormValues = z.infer<typeof formSchema>;

export default function CreateTemplatePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: '', body: '' }
  });

  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      await axiosInstance.post('/email-drafts', data);
      toast({
        title: "Success",
        description: "Template created successfully.",
      });
      navigate(-1);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (variable: string) => {
    const varText = `[${variable}]`;
    navigator.clipboard
      .writeText(varText)
      .then(() => {
        setCopiedVar(variable);
        setTimeout(() => setCopiedVar(null), 1500);
      })
      .catch(console.error);
  };

  // Filter variables based on search query (case-insensitive)
  const filteredVariables = [
    ...AVAILABLE_VARIABLES,
    ...DYNAMIC_VARIABLES
  ].filter((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="text-xs">
      <Card>
        <CardHeader className='flex flex-row items-center justify-between '>
          <div className="flex items-center gap-4">
            
            <div>
              <CardTitle className="text-2xl font-bold">
                Create Email Template
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Create a new email template. Use the variables on the left to personalize content.
              </CardDescription>
            </div>
          </div>

          <div onClick={() => navigate(-1)}>
              <Button variant="outline" size="sm" className="text-xs bg-theme text-white hover:bg-theme/90">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid grid-cols-1 gap-6 md:grid-cols-5"
            >
              {/* Left Panel: Variables */}
              <div className="md:col-span-2">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Available Variables
                </h3>

                {/* Search Input */}
                <div className="mb-3 flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search variables..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs h-8"
                  />
                </div>

                <div className="max-h-[70vh] overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-3">
                  {filteredVariables.length > 0 ? (
                    <ul className="space-y-2">
                      {filteredVariables.map((v, idx) => (
                        <li
                          key={`${v}-${idx}`}
                          className="flex flex-col rounded bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <code className="font-mono text-xs text-blue-700">{`[${v}]`}</code>
                            <Button
                              type="button"
                              variant="default"
                              size="icon"
                              className="h-6 w-6 p-0 "
                              onClick={() => handleCopy(v)}
                              disabled={loading}
                            >
                              {copiedVar === v ? (
                                <span className="text-xs ">✓</span>
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          {EXAMPLE_VALUES[v] && (
                            <span className="mt-1 text-xs text-gray-600">
                              Example:{' '}
                              <span className="font-mono text-gray-800">
                                {EXAMPLE_VALUES[v]}
                              </span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        No variables match your search
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Form */}
              <div className="space-y-4 md:col-span-3">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Subject <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter email subject" 
                          {...field} 
                          className="text-xs h-8"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Email Body <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          value={field.value}
                          onChange={field.onChange}
                          className="min-h-[60vh] w-full resize-none rounded-md border border-gray-300 p-3 text-xs focus:border-blue-500 focus:outline-none disabled:opacity-50"
                          placeholder="Write your email content. Paste variables like [firstName] or [signature id='1']."
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="text-xs"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="text-xs bg-theme text-white hover:bg-theme/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Template'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}